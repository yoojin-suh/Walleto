import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/">
            <h1 className="text-2xl font-bold bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] bg-clip-text text-transparent">
              Walleto
            </h1>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | Version 1.0
          </p>

          <div className="prose prose-purple max-w-none space-y-6 text-gray-700">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Introduction</h2>
              <p>
                Welcome to Walleto. By accessing or using our budget
                management platform and services, you agree to be bound by these
                Terms and Conditions. If you do not agree to these Terms, please do not
                use our Service.
              </p>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Account Registration</h2>
              <p className="mb-2">When you create an account with Walleto, you agree to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            {/* Use of Service */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Use of Service</h2>
              <p className="mb-2">You agree to use Walleto only for lawful purposes. You must not:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Violate any local, state, national, or international law</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit any harmful or malicious code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the Service to engage in fraudulent activities</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </section>

            {/* Financial Data */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Financial Data and Privacy</h2>
              <p>
                Walleto may sync with your financial institutions to provide budget analysis
                services. By using this feature, you authorize us to access, collect, and use your
                financial data in accordance with our Privacy Policy. We employ industry-standard
                security measures to protect your financial information.
              </p>
              <p className="mt-2">
                <strong>Important:</strong> Walleto is a budgeting tool and does not provide
                financial advice. We are not responsible for any financial decisions you make based
                on information from our Service.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Intellectual Property</h2>
              <p>
                All content, features, and functionality of Walleto, including but not limited to
                text, graphics, logos, icons, images, audio clips, and software, are the exclusive
                property of Walleto and are protected by copyright, trademark, and other
                intellectual property laws.
              </p>
            </section>

            {/* Disclaimer of Warranties */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Disclaimer of Warranties</h2>
              <p>
                THE SERVICE IS PROVIDED AS IS AND AS AVAILABLE WITHOUT WARRANTIES OF ANY KIND,
                EITHER EXPRESS OR IMPLIED. WALLETO DOES NOT WARRANT THAT THE SERVICE WILL BE
                UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WALLETO SHALL NOT BE LIABLE FOR ANY
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT
                NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATED TO YOUR USE
                OF THE SERVICE.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of any
                changes by posting the new Terms on this page and updating the Last updated date.
                Your continued use of the Service after such changes constitutes acceptance of the
                new Terms.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> legal@walleto.com<br />
                <strong>Address:</strong> Walleto Inc., 123 Finance Street, Budget City, BC 12345
              </p>
            </section>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex gap-4">
            <Link
              href="/signup"
              className="flex-1 bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition text-center"
            >
              I Accept
            </Link>
            <Link
              href="/"
              className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition text-center"
            >
              Go Back
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Walleto. All rights reserved.
      </footer>
    </div>
  );
}
