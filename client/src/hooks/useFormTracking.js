import { useEffect } from "react";

/**
 * GA4 form tracking for relevant interactions.
 * 
 * Tracks form_start and form_submit events on relevant forms:
 * - Registration form
 * - Login form
 * - Search form
 * - Checkout form
 * 
 * Captures via dataLayer:
 * - form_start when form is first interacted with
 * - form_submit on submission
 * - form_id, form_classes, form_target, form_name
 * 
 * Never captures: passwords, raw input values, payment credentials, PII
 */

const useFormTracking = () => {
    useEffect(() => {
        if (typeof window === "undefined") return;

        // Track form start when any form element receives focus
        const handleFocus = (event) => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            const form = target.closest("form");
            if (!form) return;

            window.dataLayer = window.dataLayer || [];
            // Only fire form_start once per form per session
            const formKey = `form_start_${form.id || form.className || 'unnamed'}`;
            try {
                if (!sessionStorage.getItem(formKey)) {
                    window.dataLayer.push({
                        event: "form_start",
                        form_id: form.id || undefined,
                        form_classes: form.getAttribute("class") || undefined,
                        form_name: form.getAttribute("name") || undefined,
                        form_target: form.getAttribute("target") || undefined,
                    });
                    sessionStorage.setItem(formKey, "true");
                }
            } catch {
                // sessionStorage may be blocked; continue without it
            }
        };

        // Track form submission
        const handleSubmit = (event) => {
            const form = event.target instanceof HTMLFormElement ? event.target : null;
            if (!form) return;

            window.dataLayer = window.dataLayer || [];

            window.dataLayer.push({
                event: "form_submit",
                form_id: form.id || undefined,
                form_classes: form.getAttribute("class") || undefined,
                form_target: form.getAttribute("target") || undefined,
                form_name: form.getAttribute("name") || undefined,
            });
        };

        // Add event listeners to all forms
        const forms = document.querySelectorAll("form");
        forms.forEach((form) => {
            form.addEventListener("submit", handleSubmit, false);
            // Add focus listener to first input/textarea
            const firstInput = form.querySelector("input:first-child, textarea:first-child");
            if (firstInput) {
                firstInput.addEventListener("focus", handleFocus, { passive: true });
            }
        });

        return () => {
            forms.forEach((form) => {
                form.removeEventListener("submit", handleSubmit, false);
                const firstInput = form.querySelector("input:first-child, textarea:first-child");
                if (firstInput) {
                    firstInput.removeEventListener("focus", handleFocus, { passive: true });
                }
            });
        };
    }, []);
};

export default useFormTracking;