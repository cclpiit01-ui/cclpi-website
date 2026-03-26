import PageHeader from "@/components/ui/PageHeader";
import StoreLocator from "@/components/ui/StoreLocator";
import CallToAction from "@/components/ui/CallToAction";

export default function Mortuaries() {
    return (
        <>
        {/* Page Header */}
        <PageHeader
          title="Accredited Mortuaries"
          subtitle=" Find our trusted network of accredited mortuaries nationwide. 
          All partners are carefully selected to ensure the highest quality memorial 
          services for Angelica Life Plan policyholders."
        />
  
        {/* Page Content */}
        <section className="max-w-7xl mx-auto px-6 sm:px-6 py-16">
        <StoreLocator />
        <CallToAction />
        </section>
      </>
    )
  }
  