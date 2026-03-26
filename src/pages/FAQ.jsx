import PageHeader from "@/components/ui/PageHeader";
import FaqPage from "@/components/ui/FaqPage";


// src/pages/Career.jsx
export default function FAQ() {
    return (
        <>
        {/* Page Header */}
        <PageHeader
          title="FAQ"
          subtitle=" Got questions? We’ve got answers. "
        />
  
        {/* Page Content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <FaqPage />

        </section>
      </>
    )
  }
  