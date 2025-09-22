'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="bg-black text-white min-h-screen py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">1. Introduction</h2>
              <p className="text-gray-300 mb-4">
                MyFriday, Inc. ("we," "us," or "our") operates the Friday application and services (collectively, the "Service"). This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal information when you use our Service.
              </p>
              <p className="text-gray-300">
                We value your privacy and are committed to protecting your personal information. By using the Service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">2. Information Collection and Use</h2>
              <p className="text-gray-300 mb-4">
                To provide and improve our Service, we collect several different types of information:
              </p>
              <h3 className="text-xl font-semibold mb-2 text-gray-100">Personal Information</h3>
              <p className="text-gray-300 mb-4">
                While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This may include, but is not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Location data</li>
                <li>Social connections and contacts</li>
                <li>Calendar information</li>
                <li>Communication preferences</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-2 text-gray-100">Usage Data</h3>
              <p className="text-gray-300 mb-4">
                We may also collect information on how the Service is accessed and used ("Usage Data"). This may include:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
                <li>Types of features used</li>
                <li>Time and duration of your interactions</li>
                <li>Interaction patterns and preferences</li>
                <li>Device information (type, operating system, browser)</li>
                <li>IP address and geographic location</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">3. AI and Data Processing</h2>
              <p className="text-gray-300 mb-4">
                As an AI-powered social life assistant, Friday processes your data to provide personalized services. This involves:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
                <li>Analyzing your communication patterns to suggest optimal connection times</li>
                <li>Processing calendar and location data to recommend meeting opportunities</li>
                <li>Understanding your social network to facilitate meaningful connections</li>
                <li>Learning from your preferences to provide better personalized suggestions</li>
              </ul>
              <p className="text-gray-300">
                We employ advanced security measures and anonymization techniques where appropriate to protect your privacy while providing these AI-powered services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">4. How We Use Your Information</h2>
              <p className="text-gray-300 mb-4">
                We use the information we collect for various purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
                <li>To provide and maintain our Service</li>
                <li>To personalize your experience with the Service</li>
                <li>To improve our Service based on how you use it</li>
                <li>To communicate with you about updates or changes to our Service</li>
                <li>To provide customer support</li>
                <li>To monitor usage of our Service</li>
                <li>To detect, prevent, and address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">5. Data Sharing and Disclosure</h2>
              <p className="text-gray-300 mb-4">
                We may share your information in the following situations:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
                <li><strong>With Service Providers:</strong> We may share your information with third-party companies and individuals who perform services on our behalf.</li>
                <li><strong>For Business Transfers:</strong> If we are involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction.</li>
                <li><strong>With Your Consent:</strong> We may disclose your information for any specific purpose with your consent.</li>
                <li><strong>For Legal Compliance:</strong> We may disclose your information when required by law or in response to valid requests by public authorities.</li>
              </ul>
              <p className="text-gray-300">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">6. Data Security</h2>
              <p className="text-gray-300 mb-4">
                The security of your data is important to us. We strive to use commercially acceptable means to protect your personal information, but no method of transmission over the Internet or method of electronic storage is 100% secure.
              </p>
              <p className="text-gray-300">
                We implement appropriate technical and organizational measures to protect against unauthorized access, alteration, disclosure, or destruction of your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">7. Your Data Rights</h2>
              <p className="text-gray-300 mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
                <li>The right to access the personal information we have about you</li>
                <li>The right to correct inaccurate or incomplete information</li>
                <li>The right to delete your personal information</li>
                <li>The right to restrict or object to our processing of your data</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent at any time</li>
              </ul>
              <p className="text-gray-300">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">8. Cookies and Tracking</h2>
              <p className="text-gray-300 mb-4">
                We use cookies and similar tracking technologies to track activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
              </p>
              <p className="text-gray-300">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">9. Children's Privacy</h2>
              <p className="text-gray-300 mb-4">
                Our Service is not directed to anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If we discover that a child under 13 has provided us with personal information, we will promptly delete this from our servers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">10. Changes to This Privacy Policy</h2>
              <p className="text-gray-300 mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
              <p className="text-gray-300">
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#11d0be]">11. Contact Us</h2>
              <p className="text-gray-300">
                If you have any questions about this Privacy Policy, please contact us at app.myfriday@gmail.com.
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
