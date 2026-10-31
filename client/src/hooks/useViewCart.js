import { useEffect } from "react";

/**
 * Tracks a cart page view.
 * Wire up your analytics provider here (e.g. GA4 / Meta / TikTok view_cart event).
 * Kept as a no-op placeholder so the Cart page keeps working without an analytics
 * integration configured.
 */
const useViewCart = ({ cartData }) => {
    useEffect(() => {
        // Example (uncomment and adapt when an analytics SDK is added):
        // if (window.gtag) {
        //     window.gtag("event", "view_cart", {
        //         items: cartData?.items?.map((item) => ({
        //             item_id: item.cakeId,
        //             item_name: item.name,
        //             quantity: item.quantity,
        //         })) || [],
        //     });
        // }
    }, [cartData]);
};

export default useViewCart;
