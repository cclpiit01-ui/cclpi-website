import PageHeader from "@/components/ui/PageHeader";

const PrivacyStatement = () => {
  return (
    <>
      {/* Page Header */}
      <PageHeader
        title="Privacy Statement"
        subtitle="Supplementary Privacy Manual For Particular Processing: Website Processing (Version 1.0)"
      />

      {/* Page Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="space-y-10 text-sm sm:text-base text-gray-700 leading-relaxed">

          {/* Effective Date */}
          <div className="text-xs sm:text-sm text-gray-500 border-b pb-4">
            <p>Effective Date: September 10, 2026 &nbsp;|&nbsp; Last Updated: September 10, 2026</p>
          </div>

          {/* 1. Introduction & Scope */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2 underline decoration-blue-500 underline-offset-4">
              1. Scope and Supplement
            </h2>
            <p>
              This Supplementary Privacy Manual is for the processing of personal data through <strong>https://cclpi.com.ph</strong> and its subpages. All terms and provisions in the Main Privacy Manual of <strong>Cosmopolitan CLIMBS Life Plan Inc. (CCLPI Plans)</strong> continue to be in full force and effect, as supplemented by this notice.
            </p>
          </div>

          {/* 2. Collection of Data */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              2. Collection (LPAF)
            </h2>
            <p className="mb-3">
              CCLPI Plans collects basic contact information required by <strong>MID, AMLA, CIC, and NPC</strong> through the Life Plan Application Form (LPAF). This includes:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-gray-50 p-4 rounded-md text-gray-800">
              <ul className="list-disc pl-5 space-y-1">
                <li>Full Name & Birthdate</li>
                <li>Nationality</li>
                <li>Email Address</li>
                <li>Contact Numbers</li>
              </ul>
              <ul className="list-disc pl-5 space-y-1">
                <li>Home & Business Address</li>
                <li>Employment Details</li>
                <li>Beneficiaries Name & Address</li>
                <li>Other related personal information</li>
              </ul>
            </div>
          </div>

          {/* 3. AI Chatbot (Angelica AI) */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              3. AI Chatbot (Angelica AI)
            </h2>
            <p className="mb-3">
              Our website features an AI-powered chatbot named <strong>Angelica AI</strong>, which assists visitors with inquiries about our pre-need plans and related services. When you interact with Angelica AI, we may collect information you voluntarily provide during the conversation, such as your name, contact number, email address, and the nature of your inquiry, for the purpose of:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Responding to your questions about our products and services</li>
              <li>Capturing your details as a lead so our sales personnel can follow up with you</li>
              <li>Routing your inquiry to the appropriate department</li>
              <li>Improving the accuracy and quality of Angelica AI's responses</li>
            </ul>
            <p className="mt-3">
              Information captured through Angelica AI is handled with the same safeguards described in this Privacy Statement and is only accessed by authorized CCLPI personnel for legitimate business purposes.
            </p>
            <p className="mt-3">
              To generate its responses, Angelica AI processes your conversation using <strong>OpenAI's AI models</strong>, a third-party service provider based outside the Philippines. This means limited conversation data may be transferred to and processed on servers located abroad, solely for the purpose of generating a response. We require this provider to maintain confidentiality and apply data protection safeguards consistent with this Privacy Statement. Please avoid sharing sensitive personal information (e.g., full ID numbers or financial account details) directly in the chatbot conversation.
            </p>
          </div>

          {/* 4. Purpose of Processing */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              4. Processing Purposes
            </h2>
            <p className="mb-2 italic">We process your information for the following specific purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Management:</strong> To facilitate account creation, authentication, and keep accounts in working order.</li>
              <li><strong>Service Delivery:</strong> To deliver and facilitate the delivery of requested services.</li>
              <li><strong>Support:</strong> To respond to inquiries and solve potential issues with requested services.</li>
              <li><strong>Administration:</strong> To send details about products, services, and changes to terms or policies.</li>
              <li><strong>Compliance:</strong> To comply with legal obligations (KYC/AMLA), respond to legal requests, and defend legal rights.</li>
              <li><strong>Feedback & Marketing:</strong> To request feedback and send promotional communications in accordance with your marketing preferences.</li>
            </ul>
          </div>

          {/* 5. Use and Disclosure */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              5. Use and Disclosure
            </h2>
            <p>
              Personal data is used for documentation purposes, including <strong>Know Your Client (KYC)</strong> in compliance with AMLA. CCLPI Plans may disclose Personal Data to employees, authorized representatives, related companies, and <strong>Third-Party Service Providers (such as Payment Processors like GCash, and AI service providers such as OpenAI)</strong>.
            </p>
          </div>

          {/* 6. Consent */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              6. Consent and Withdrawal
            </h2>
            <p className="mb-2">
              By submitting a form on our website (such as the LPAF or an inquiry form), or by voluntarily chatting with Angelica AI, you consent to the collection and processing of your personal data as described in this Privacy Statement.
            </p>
            <p>
              You may withdraw your consent at any time, subject to legal or contractual restrictions, by contacting our Data Privacy Officer using the details in Section 12. Please note that withdrawing consent may affect our ability to process your application or continue delivering certain services.
            </p>
          </div>

          {/* 7. Data Retention */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              7. Data Retention
            </h2>
            <p>
              We retain personal data only for as long as necessary to fulfill the purposes described in this Privacy Statement, to maintain your plan and account records, and to comply with legal, regulatory, and audit requirements imposed by the Insurance Commission, AMLA, and other applicable authorities. Once data is no longer necessary or required to be kept, it is securely disposed of or anonymized.
            </p>
          </div>

          {/* 8. Cookies and Tracking */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              8. Cookies and Tracking
            </h2>
            <p>
              Our website does not currently use analytics or advertising tracking tools (such as Google Analytics or Meta Pixel). We may use strictly necessary cookies required for basic website functionality. Should we adopt analytics or tracking tools in the future, this Privacy Statement will be updated accordingly.
            </p>
          </div>

          {/* 9. Access and Retention */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              9. Access, Storage, and Destruction
            </h2>
            <p className="mb-2">
              Only the client and authorized representatives shall be allowed to access sensitive personal data. We implement security measures to protect against unlawful destruction or disclosure.
            </p>
            <p>
              All employees maintain confidentiality even after resignation or termination. Personal data on the devices of separating employees is subject to verification and mandatory deletion.
            </p>
          </div>

          {/* 10. Security Incident Notification */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              10. Security Incident Notification
            </h2>
            <p>
              In the event of a personal data breach that poses a real risk of serious harm to affected data subjects, CCLPI Plans will notify the National Privacy Commission and affected clients within the period required by law, and will take reasonable steps to mitigate the impact of the incident.
            </p>
          </div>

          {/* 11. Cross-Border Data Transfer */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              11. Cross-Border Data Transfer
            </h2>
            <p>
              Certain third-party service providers we engage, such as our AI chatbot provider (OpenAI) and payment processors, may store or process data outside the Philippines. Where this occurs, we require these providers to maintain a standard of data protection comparable to that required under Philippine law.
            </p>
          </div>

          {/* 12. Legal Rights & DPO */}
          <div className="border-t pt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              12. Your Rights (RA 10173)
            </h2>
            <p className="mb-3">
              As a data subject, you are afforded the following rights under the <strong>Data Privacy Act of 2012</strong>:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><strong>Right to be Informed</strong> that your personal data will be, is being, or has been processed.</li>
              <li><strong>Right to Access</strong> your personal data that we hold.</li>
              <li><strong>Right to Object</strong> to the processing of your personal data.</li>
              <li><strong>Right to Rectification</strong> of inaccurate or incomplete data.</li>
              <li><strong>Right to Erasure or Blocking</strong> of your data under certain conditions.</li>
              <li><strong>Right to Data Portability</strong>, where applicable.</li>
              <li><strong>Right to be Indemnified</strong> for damages resulting from inaccurate, incomplete, or unauthorized use of your personal data.</li>
              <li><strong>Right to File a Complaint</strong> with the National Privacy Commission (NPC).</li>
            </ul>
            <p className="mb-4">
              To exercise any of these rights, please send a written request to our Data Privacy Officer using the contact details below. We will respond to your request within a reasonable period, in accordance with applicable law.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-5">
              <p className="font-bold text-blue-900 mb-1">Data Privacy Officer (DPO)</p>
              <p className="text-blue-800">COSMOPOLITAN CLIMBS LIFE PLAN</p>
              <p className="text-blue-800 text-sm">35 Jesus V. Seriña St. Brgy. Carmen, Cagayan de Oro City, Misamis Oriental</p>
              <div className="mt-3 flex flex-col sm:flex-row sm:gap-6 text-sm font-semibold">
                <span>📞 (088) 854-1574</span>
                <span>📧 cclpidpo@gmail.com</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default PrivacyStatement;
