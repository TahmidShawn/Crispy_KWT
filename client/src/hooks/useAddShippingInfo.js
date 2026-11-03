import { useEffect, useState } from "react";

/**
 * Tracks the GA4 "add_shipping_info" event once when the user saves the
 * shipping address used for checkout.
 * 
 * Usage in Checkout.jsx:
 * const trackAddShippingInfo = useAddShippingInfo();
 * Then call: trackAddShippingInfo({ savedAddress, totalPrice });
 * 
 * The event fires once on first call with valid data.
 * IMPORTANT: Never sends PII to GA4. Only includes non-personal
 * ecommerce information. Address details, name, phone, and notes
 * are collected for order processing but NOT sent to GA4.
 * 
 * @param {{ savedAddress: Object, totalPrice: number }} params
 * @returns {Function} trackAddShippingInfo - function to fire the event
 */
const useAddShippingInfo = () => {
    const [hasFired, setHasFired] = useState(false);
    
    return (params) => {
        if (hasFired) return;
        if (!params) return;
        
        const { savedAddress, totalPrice = 0 } = params;
        
        // Validate total price - do NOT check savedAddress.fullName or other PII
        // The savedAddress is used for order backend, not for GA4
        if (!Number.isFinite(Number(totalPrice)) || Number(totalPrice) <= 0) return;
        
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            ecommerce: null,
        });
        
        // Only include non-PII shipping information in GA4
        // Address details (fullName, phone, governorate, area, street, etc.) 
        // are NOT sent to GA4 - they are used only for order processing
        const shippingInfo = {};
        
        window.dataLayer.push({
            event: "add_shipping_info",
            ecommerce: {
                currency: "KWD",
                value: Number(totalPrice.toFixed(3)),
                // shipping object omitted to avoid PII - 
                // address details are for backend only
                items: [], // Items will be populated by the component if available
            },
        });
        
        setHasFired(true);
    };
};

export default useAddShippingInfo;
