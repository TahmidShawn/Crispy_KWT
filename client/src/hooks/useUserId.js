import { useEffect } from "react";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

/**
 * GA4 User-ID tracking using internal user identifier.
 * 
 * Uses the user's MongoDB _id as the GA4 User-ID, which is a stable,
 * non-PII identifier. Never uses email, phone, username, or name.
 * 
 * User-ID is set when user logs in and cleared on logout.
 * Supports both logged-in and guest user journeys.
 */

const useUserId = () => {
    const { user, clearUser } = useContext(AuthContext);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const setUserId = () => {
            if (user && user._id) {
                // Use MongoDB _id as GA4 User-ID (non-PII, stable identifier)
                const userId = String(user._id);
                try {
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                        event: "set_user_id",
                        user_id: userId,
                    });
                    // Also set via gtag if available
                    if (window.gtag) {
                        window.gtag("set", { user_id: userId });
                    }
                } catch {
                    // Ignore errors if dataLayer or gtag is unavailable
                }
            } else {
                // Clear User-ID when user logs out
                try {
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                        event: "set_user_id",
                        user_id: null,
                    });
                    if (window.gtag) {
                        window.gtag("set", { user_id: null });
                    }
                } catch {
                    // Ignore errors
                }
            }
        };

        setUserId();

        // Re-set User-ID if user changes (e.g., re-authentication)
        // This will be triggered by AuthContext changes

    }, [user]);

    return {};
};

export default useUserId;