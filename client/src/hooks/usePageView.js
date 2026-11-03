import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

const usePageView = () => {
    const location = useLocation();
    const navigate = useNavigate();
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

    // Whenever location changes, also update the page title via Helmet
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Small delay to allow Helmet to update the title
            const timeout = setTimeout(() => {
                const helmedTitle = document.querySelector(
                    'meta[property="og:title"]',
                );
                if (helmedTitle) {
                    document.title = helmedTitle.content;
                }
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [location]);

    return {};
};

export default usePageView;
