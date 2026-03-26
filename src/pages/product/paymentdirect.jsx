import { Reveal } from "@/components/animation/Reveal";

const PaymentDirect = () => {
  return (<div className="max-w-6xl mx-auto pb-24">
        <Reveal direction="bottom">
            <div className="mt-24 text-center p-12 bg-brand-primary rounded-[3rem] text-white shadow-2xl relative overflow-hidden">

              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />

              <h3 className="text-3xl font-heading font-black uppercase mb-4">
                WHERE TO PAY?
              </h3>

              <p className="max-w-2xl mx-auto text-white/70 font-sans leading-relaxed pb-8">
                Making your payments hassle-free. Find an authorized payment center near you or pay online.
              </p>
            <a
              href="/products/payment"
              className="inline-flex items-center bg-brand-accent hover:bg-brand-secondary text-white font-semibold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              See payment channels
            </a>

            </div>
            </Reveal>
        </div>
  );
};

export default PaymentDirect;