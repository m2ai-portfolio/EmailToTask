import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Turn Your Emails Into<br />
            <span className="text-blue-600">Actionable Tasks</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Forward emails to your personal address and automatically convert them into 
            organized, prioritized tasks. Stop letting important emails get lost in the noise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-primary text-lg">
              Start Free Trial
            </Link>
            <Link href="#features" className="btn-secondary text-lg">
              See How It Works
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • 14-day free trial
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-semibold mb-2">1. Forward Email</h3>
              <p className="text-gray-600">
                Forward any email to your unique address like <code className="bg-gray-100 px-2 py-1 rounded">you@beta.irhuman.ai</code>
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">2. Auto-Process</h3>
              <p className="text-gray-600">
                Our AI extracts the task, sets priority, and adds context automatically
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">3. Get Organized</h3>
              <p className="text-gray-600">
                View, manage, and complete tasks in your personalized dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-2">🎯 Smart Priority Detection</h3>
              <p className="text-gray-600">
                Automatically detects urgency based on language, sender, and context
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-2">🏷️ Auto-Tagging</h3>
              <p className="text-gray-600">
                Tags tasks by category (work, personal, urgent, follow-up)
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-2">📅 Due Date Extraction</h3>
              <p className="text-gray-600">
                Recognizes dates and deadlines mentioned in emails
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-2">🔄 Two-Way Sync</h3>
              <p className="text-gray-600">
                Reply to task notifications to update status or add notes
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-2">📊 Productivity Analytics</h3>
              <p className="text-gray-600">
                Track your task completion rates and productivity trends
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-2">🔒 Privacy-First</h3>
              <p className="text-gray-600">
                Your emails are processed securely and never sold to third parties
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Simple Pricing</h2>
          <p className="text-center text-gray-600 mb-12">Choose the plan that fits your needs</p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="card border-2 border-gray-200">
              <h3 className="text-xl font-semibold mb-2">Starter</h3>
              <div className="text-4xl font-bold mb-4">$0<span className="text-lg font-normal text-gray-600">/mo</span></div>
              <ul className="space-y-2 mb-6 text-gray-600">
                <li>✓ 50 tasks/month</li>
                <li>✓ Basic priority detection</li>
                <li>✓ 7-day history</li>
                <li>✓ Email support</li>
              </ul>
              <Link href="/signup?plan=free" className="btn-secondary w-full block text-center">
                Get Started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="card border-2 border-blue-500 relative">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-4">$9<span className="text-lg font-normal text-gray-600">/mo</span></div>
              <ul className="space-y-2 mb-6 text-gray-600">
                <li>✓ Unlimited tasks</li>
                <li>✓ Advanced AI processing</li>
                <li>✓ Due date extraction</li>
                <li>✓ Auto-tagging</li>
                <li>✓ 90-day history</li>
                <li>✓ Priority support</li>
              </ul>
              <Link href="/signup?plan=pro" className="btn-primary w-full block text-center">
                Start Free Trial
              </Link>
            </div>

            {/* Team Tier */}
            <div className="card border-2 border-gray-200">
              <h3 className="text-xl font-semibold mb-2">Team</h3>
              <div className="text-4xl font-bold mb-4">$29<span className="text-lg font-normal text-gray-600">/mo</span></div>
              <ul className="space-y-2 mb-6 text-gray-600">
                <li>✓ Everything in Pro</li>
                <li>✓ Up to 5 team members</li>
                <li>✓ Shared task boards</li>
                <li>✓ Team analytics</li>
                <li>✓ API access</li>
                <li>✓ Dedicated support</li>
              </ul>
              <Link href="/signup?plan=team" className="btn-secondary w-full block text-center">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">What Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <p className="text-gray-600 mb-4">
                "I was drowning in email. EmailToTask helped me capture every action item instantly. 
                My productivity doubled in the first week."
              </p>
              <p className="font-semibold">— Sarah K., Product Manager</p>
            </div>
            <div className="card">
              <p className="text-gray-600 mb-4">
                "The AI is surprisingly good at understanding context. It knows which emails are 
                urgent and which can wait. Game changer for my workflow."
              </p>
              <p className="font-semibold">— Mike R., Freelance Developer</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Organized?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who turned their emails into actionable tasks
          </p>
          <Link href="/signup" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block">
            Start Your Free Trial
          </Link>
          <p className="mt-4 text-sm opacity-75">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">EmailToTask</h3>
            <p className="text-sm">
              Turn emails into actionable tasks automatically.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#features" className="hover:text-white">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
              <li><a href="#" className="hover:text-white">API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-white">Terms</a></li>
              <li><a href="#" className="hover:text-white">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-800 text-sm text-center">
          © 2026 EmailToTask. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
