import { useEffect } from "react";

/**
 * GA4 remove_from_cart event when items are removed from the cart.
 * 
 * Tracks when users remove individual items from their shopping cart.
 * 
 * Events tracked:
 * - remove_from_cart
 * 
 * Parameters:
 * - item_id: The product ID being removed
 * - item_name: The product name
 * - price: The product price
 * - quantity: The quantity being removed
 */

const useRemoveFromCart = ({ itemId, itemName, price, quantity }) => {
    useEffect(() => {
        if (typeof window === "undefined") return;

        window.dataLayer = window.dataLayer || [];

        window.dataLayer.push({
            ecommerce: null,
        });

        window.dataLayer.push({
            event: "remove_from_cart",
            ecommerce: {
                currency: "KWD",
                value: Number((price || 0).toFixed(3)),
                items: [{
                    item_id: String(itemId || ''),
                    item_name: itemName || "Unknown product",
                    price: Number(price || 0),
                    quantity: Number(quantity || 1),
                }],
            },
        });
    }, [itemId, itemName, price, quantity]);
};

export default useRemoveFromCart;