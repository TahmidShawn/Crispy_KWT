import { useEffect } from "react";

/**
 * Tracks the GA4 "search" event when the user submits a search term.
 *
 * Uses the `search_term` parameter recommended by GA4.
 *
 * @param {{ trigger: boolean, searchTerm: string }} params
 */
const useSearchEvent = ({ trigger, searchTerm }) => {
    useEffect(() => {
        if (!trigger) return;

        const term = searchTerm?.trim();
        if (!term) return;

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "search",
            search_term: term,
        });
    }, [trigger, searchTerm]);
};

export default useSearchEvent;
