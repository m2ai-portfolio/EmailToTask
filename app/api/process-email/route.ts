import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

// Process incoming email and convert to task
export async function POST(req: NextRequest) {
  try {
    // Parse email data (this would come from email forwarder like Mailgun, Resend, etc.)
    const emailData = await req.json()
    
    const {
      to, // The forwarding address (e.g., user123@beta.irhuman.ai)
      from,
      subject,
      body,
      html,
    } = emailData

    // Find user by forwarding address
    const { data: forwardingAddress, error: addressError } = await supabase
      .from('email_forwarding_addresses')
      .select('user_id')
      .eq('address', to)
      .eq('is_active', true)
      .single()

    if (addressError || !forwardingAddress) {
      return NextResponse.json(
        { error: 'Invalid forwarding address' },
        { status: 404 }
      )
    }

    const userId = forwardingAddress.user_id

    // Parse email content to extract task information
    const parsedTask = await parseEmailToTask(body, html || subject)

    // Create email record
    const { data: emailRecord, error: emailError } = await supabase
      .from('emails')
      .insert({
        user_id: userId,
        from_email: from,
        subject,
        body: html || body,
        parsed_content: parsedTask,
        status: 'pending',
      })
      .select()
      .single()

    if (emailError) {
      console.error('Failed to create email record:', emailError)
      return NextResponse.json(
        { error: 'Failed to process email' },
        { status: 500 }
      )
    }

    // Create task from parsed content
    const task = await createTaskFromEmail(userId, emailRecord.id, parsedTask)

    // Send confirmation email
    await sendConfirmationEmail(from, task)

    return NextResponse.json({
      success: true,
      taskId: task.id,
      message: 'Email processed successfully',
    })
  } catch (err) {
    console.error('Email processing error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Parse email content to extract task details
async function parseEmailToTask(textBody: string, htmlBody?: string): Promise<any> {
  // Simple parsing logic (can be enhanced with AI later)
  const content = htmlBody || textBody
  
  // Extract priority keywords
  let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  const urgencyWords = {
    urgent: ['urgent', 'asap', 'immediately', 'critical', 'emergency', 'right now'],
    high: ['important', 'priority', 'soon', 'today', 'tomorrow'],
    low: ['when you can', 'when possible', 'later', 'someday'],
  }

  const lowerContent = content.toLowerCase()
  
  if (urgencyWords.urgent.some(word => lowerContent.includes(word))) {
    priority = 'urgent'
  } else if (urgencyWords.high.some(word => lowerContent.includes(word))) {
    priority = 'high'
  } else if (urgencyWords.low.some(word => lowerContent.includes(word))) {
    priority = 'low'
  }

  // Extract due date (simple pattern matching)
  const datePatterns = [
    /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/, // MM/DD/YYYY
    /(\d{1,2})-(\d{1,2})-(\d{2,4})/,   // YYYY-MM-DD
    /due\s+(?:on\s+)?([a-z]+\s+\d{1,2}(?:st|nd|rd|th)?)/i, // "due on Monday, Jan 15th"
  ]

  let dueDate: string | undefined
  for (const pattern of datePatterns) {
    const match = content.match(pattern)
    if (match) {
      // Simple date parsing (enhance with date-fns or dayjs)
      dueDate = new Date().toISOString() // Placeholder
      break
    }
  }

  // Extract tags
  const tags: string[] = []
  const tagPatterns = {
    'work': ['work', 'job', 'meeting', 'deadline', 'client', 'project'],
    'personal': ['personal', 'family', 'home', 'shopping'],
    'follow-up': ['follow-up', 'follow up', 'call', 'email back'],
    'research': ['research', 'look into', 'investigate', 'read'],
  }

  for (const [tag, keywords] of Object.entries(tagPatterns)) {
    if (keywords.some(word => lowerContent.includes(word))) {
      tags.push(tag)
    }
  }

  return {
    priority,
    due_date: dueDate,
    tags,
    extracted_entities: extractEntities(content),
  }
}

// Extract entities (names, organizations, etc.)
function extractEntities(content: string): any {
  // Simple entity extraction (can be enhanced with NLP)
  return {
    mentions: content.match(/@\w+/g) || [],
    links: content.match(/https?:\/\/[^\s]+/g) || [],
  }
}

// Create task from parsed email
async function createTaskFromEmail(
  userId: string,
  emailId: string,
  parsedData: any
): Promise<any> {
  const title = parsedData.title || 'Task from email'
  
  const taskData = {
    user_id: userId,
    email_id: emailId,
    title: title,
    description: parsedData.description || '',
    priority: parsedData.priority || 'medium',
    status: 'todo',
    due_date: parsedData.due_date,
    tags: parsedData.tags || [],
    metadata: parsedData.extracted_entities,
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert(taskData)
    .select()
    .single()

  if (error) {
    console.error('Failed to create task:', error)
    throw error
  }

  return data
}

// Send confirmation email to user
async function sendConfirmationEmail(toEmail: string, task: any) {
  try {
    await resend.emails.send({
      from: 'EmailToTask <noreply@beta.irhuman.ai>',
      to: toEmail,
      subject: `Task Created: ${task.title}`,
      html: `
        <h2>Task Created Successfully!</h2>
        <p>Your task has been added to your dashboard:</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <strong>Title:</strong> ${task.title}<br>
          <strong>Priority:</strong> ${task.priority}<br>
          <strong>Status:</strong> ${task.status}
        </div>
        <p><a href="https://beta.irhuman.ai/dashboard" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Dashboard</a></p>
      `,
    })
  } catch (err) {
    console.error('Failed to send confirmation email:', err)
    // Don't fail the request if email fails
  }
}
