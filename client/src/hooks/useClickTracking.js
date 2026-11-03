import { useEffect } from "react";

/**
 * GA4 click tracking for relevant interactions.
 * 
 * Tracks click events on navigation links, CTA buttons, and other
 * interactive elements. Uses GTM built-in variables where possible.
 * 
 * Events tracked:
 * - click (generic for relevant elements)
 * 
 * Captures via dataLayer:
 * - click_element (element selector)
 * - click_classes
 * - click_id
 * - click_target
 * - click_text
 * - click_url
 */

const useClickTracking = () => {
    useEffect(() => {
        if (typeof window === "undefined") return;

        const handler = (event) => {
            // Track clicks on links (except outbound if needed, 
            // or let GTM handle it)
            const target = event.target as HTMLElement;

            // Only track if the click has analytics value
            // Skip if clicking inside input/textarea/select
            if (target.tagName === "INPUT" || 
                target.tagName === "TEXTAREA" || 
                target.tagName === "SELECT" ||
                target.closest("input") ||
                target.closest("textarea") ||
                target.closest("select")) {
                return;
            }

            window.dataLayer = window.dataLayer || [];

            window.dataLayer.push({
                event: "click",
                click_element: target.id || target.getAttribute("id") || undefined,
                click_classes: target.getAttribute("class") || undefined,
                click_id: target.getAttribute("id") || undefined,
                click_target: target.getAttribute("target") || undefined,
                click_text: target.innerText || target.textContent || undefined,
                click_url: target.getAttribute("href") || target.getAttribute("data-href") || undefined,
            });
        };

        document.addEventListener("click", handler, false);

        return () => {
            document.removeEventListener("click", handler, false);
        };
    }, []);
};

export default useClickTracking;