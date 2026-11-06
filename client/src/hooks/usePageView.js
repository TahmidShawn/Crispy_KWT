import { useEffect } from "react";
import { useLocation } from "react-router";

const usePageView = () => {
    const location = useLocation();

    useEffect(() => {
        // Track initial page view on mount (only on client side)
        if (typeof window !== "undefined") {
            const referrer = document.referrer || undefined;

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: "page_view",
                page_path: location.pathname + location.search + location.hash,
                page_location: location.href,
                page_hostname: location.hostname,
                page_title: document.title,
                page_referrer: referrer,
            });
        }
    }, [location]);

    return undefined;
};

export default usePageView;
