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

          {/* 3. Purpose of Processing */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              3. Processing Purposes
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

          {/* 4. Use and Disclosure */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              4. Use and Disclosure
            </h2>
            <p>
              Personal data is used for documentation purposes, including <strong>Know Your Client (KYC)</strong> in compliance with AMLA. CCLPI Plans may disclose Personal Data to employees, authorized representatives, related companies, and <strong>Third-Party Service Providers (such as Payment Processors like GCash)</strong>.
            </p>
          </div>

          {/* 5. Access and Retention */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              5. Access, Storage, and Destruction
            </h2>
            <p className="mb-2">
              Only the client and authorized representatives shall be allowed to access sensitive personal data. We implement security measures to protect against unlawful destruction or disclosure.
            </p>
            <p>
              All employees maintain confidentiality even after resignation or termination. Personal data on the devices of separating employees is subject to verification and mandatory deletion.
            </p>
          </div>

          {/* 6. Legal Rights & DPO */}
          <div className="border-t pt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              6. Your Rights (RA 10173)
            </h2>
            <p className="mb-4">
              You are afforded certain rights under the <strong>Data Privacy Act of 2012</strong>, including the right to object to processing, the right to access, correct inaccurate data, and the right to erasure or blocking.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-5">
              <p className="font-bold text-blue-900 mb-1">Data Privacy Officer (DPO)</p>
              <p className="text-blue-800">COSMOPOLITAN CLIMBS LIFE PLAN</p>
              <p className="text-blue-800 text-sm">4/F CLIMBS Bldg. Tiano-Pacana Sts, Cagayan de Oro City, Misamis Oriental</p>
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