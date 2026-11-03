import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * GA4 view_item_list event for category and product listing pages.
 * 
 * Tracks when users view a list of items (products in a category,
 * search results, promotions, etc.).
 * 
 * Events tracked:
 * - view_item_list
 * 
 * Parameters:
 * - item_list_id: The category ID or list identifier
 * - item_list_name: The category name or list name
 * - currency: KWD
 * - value: Total value of items in the list
 * - items: Array of item summaries
 */

const useViewItemList = ({ items, itemListId, itemListName }) => {
    const { pathname } = useLocation();

    useEffect(() => {
        if (!items || items.length === 0) return;
        if (typeof window === "undefined") return;

        const basePrice = items.reduce((sum, item) => {
            const price = Number(item.price ?? item.discountedPrice ?? 0);
            return sum + price;
        }, 0);

        window.dataLayer = window.dataLayer || [];

        // Clear previous ecommerce data
        window.dataLayer.push({
            ecommerce: null,
        });

        window.dataLayer.push({
            event: "view_item_list",
            ecommerce: {
                currency: "KWD",
                value: Number(basePrice.toFixed(3)),
                items: items.map((item) => ({
                    item_id: String(item._id || item.id || item),
                    item_name: item.name?.en || item.name?.ar || "Unknown product",
                    item_category: item.category?.name?.en || undefined,
                    price: Number(item.discountedPrice ?? item.price ?? 0),
                    quantity: Number(item.quantity ?? 1),
                })),
            },
        });
    }, [items, itemListId, itemListName]);
};

export default useViewItemList;