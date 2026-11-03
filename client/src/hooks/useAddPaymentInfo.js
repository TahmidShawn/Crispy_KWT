import { useEffect, useState } from "react";

const useAddPaymentInfo = () => {
    const [hasFired, setHasFired] = useState(false);

    return (params) => {
        if (hasFired) return;
        if (!params) return;

        const { paymentMethod, totalPrice = 0 } = params;

        if (!paymentMethod) return;
        if (!Number.isFinite(Number(totalPrice)) || Number(totalPrice) <= 0)
            return;

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            ecommerce: null,
        });

        window.dataLayer.push({
            event: "add_payment_info",
            ecommerce: {
                currency: "KWD",
                value: Number(totalPrice.toFixed(3)),
                payment_method: paymentMethod,
            },
        });

        setHasFired(true);
    };
};

export default useAddPaymentInfo;
