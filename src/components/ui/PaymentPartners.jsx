import bdo from "@/assets/payment/bdo-logo.jpg";
import bpi from "@/assets/payment/bpi-logo.jpg";
import china from "@/assets/payment/china-logo.jpg";
import gcash from "@/assets/payment/gcash.jpg";
import landbank from "@/assets/payment/landbank-copy.jpg";
import mb from "@/assets/payment/mb-logo.jpg";
import pnb from "@/assets/payment/pnb-logo.jpg";

const payments = [

    { name: "BDO", src: bdo },
    { name: "BPI", src: bpi },
    { name: "China Bank", src: china },
    { name: "GCash", src: gcash },
    { name: "Landbank", src: landbank },
    { name: "Metrobank", src: mb },
    { name: "PNB", src: pnb },
];

const PaymentPartners = () => {

    return (
        <div>
        <h4 className="text-sm font-bold text-white mb-4">
          PAYMENT PARTNERS
        </h4>

      <div className="flex items-center gap-3 flex-wrap">
        {payments.map((payment) => (
          <div
            key={payment.name}
            className="flex h-10 w-[70px] items-center justify-center rounded bg-white shadow"
          >
            <img
              src={payment.src}
              alt={payment.name}
              className="h-6 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
    );
}

export default PaymentPartners;