'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="bg-black text-white min-h-screen py-20">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-center">Terms and Conditions</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">1. Introduction</h2>
              <p className="text-gray-300 mb-4">
                Welcome to Friday! These Terms and Conditions (&quot;Terms&quot;) govern your use of the Friday application and services 
                (collectively, the &quot;Service&quot;) operated by MyFriday, Inc. (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
              </p>
              <p className="text-gray-300">
                By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of 
                the Terms, you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">2. Use of the Service</h2>
              <p className="text-gray-300 mb-4">
                Friday is an AI-powered social life assistant designed to help you maintain and enhance your social connections.
              </p>
              <p className="text-gray-300 mb-4">
                You may use our Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
                <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
                <li>To send, knowingly receive, upload, download, use, or re-use any material that does not comply with these Terms.</li>
                <li>To impersonate or attempt to impersonate MyFriday, Inc., a MyFriday employee, another user, or any other person or entity.</li>
                <li>To engage in any other conduct that restricts or inhibits anyone&apos;s use or enjoyment of the Service, or which may harm MyFriday, Inc. or users of the Service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">3. Account Registration</h2>
              <p className="text-gray-300 mb-4">
                To access certain features of the Service, you may be required to register for an account. When you register for an account, you agree to provide accurate, current, and complete information about yourself.
              </p>
              <p className="text-gray-300">
                You are responsible for safeguarding your account and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access to or use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">4. AI and Automated Features</h2>
              <p className="text-gray-300 mb-4">
                The Friday service employs artificial intelligence to provide personalized assistance with social interactions and planning. You understand and acknowledge that:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
                <li>AI systems are not perfect and may occasionally provide inaccurate or inappropriate suggestions.</li>
                <li>You are responsible for reviewing and approving any actions or communications suggested by Friday before they are executed.</li>
                <li>Friday may analyze your interaction patterns and communication history to provide better assistance.</li>
                <li>Friday may learn from user interactions to improve its services for all users.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">5. Intellectual Property</h2>
              <p className="text-gray-300 mb-4">
                The Service and its original content, features, and functionality are and will remain the exclusive property of MyFriday, Inc. and its licensors. The Service is protected by copyright, trademark, and other laws of the United States and foreign countries.
              </p>
              <p className="text-gray-300">
                You agree not to reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">6. User Content</h2>
              <p className="text-gray-300 mb-4">
                You retain ownership of any content you submit to the Service. By providing content to our Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your content in any existing or future media.
              </p>
              <p className="text-gray-300">
                You represent and warrant that your content does not violate any rights of any other person or entity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">7. Privacy</h2>
              <p className="text-gray-300 mb-4">
                Your use of our Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">8. Termination</h2>
              <p className="text-gray-300 mb-4">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including without limitation if you breach these Terms.
              </p>
              <p className="text-gray-300">
                Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">9. Limitation of Liability</h2>
              <p className="text-gray-300 mb-4">
                In no event shall MyFriday, Inc., nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
                <li>Your access to or use of or inability to access or use the Service.</li>
                <li>Any conduct or content of any third party on the Service.</li>
                <li>Any content obtained from the Service.</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">10. Changes to Terms</h2>
              <p className="text-gray-300 mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days&apos; notice prior to any new terms taking effect.
              </p>
              <p className="text-gray-300">
                By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">11. Contact Us</h2>
              <p className="text-gray-300">
                If you have any questions about these Terms, please contact us at app.myfriday@gmail.com.
              </p>
            </section>

            <div className="text-center pt-10 pb-6 text-gray-400">
              <p>Last updated: September 22, 2025</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
