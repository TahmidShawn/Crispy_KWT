
import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const useViewItem = ({ product }) => {
    const { language = "en" } = useLanguage();

    useEffect(() => {
        if (!product?._id) return;

        const basePrice = Number(product.price ?? 0);
        const discountPercentage = Number(
            product.discountPercentage ?? 0,
        );

        const price = Number(
            product.discountedPrice ??
                (
                    basePrice -
                    (basePrice * discountPercentage) / 100
                ).toFixed(3),
        );

        const itemName =
            product.name?.[language] ||
            product.name?.en ||
            "Unknown product";

        const itemCategory =
            product.category?.name?.[language] ||
            product.category?.name?.en ||
            undefined;

        window.dataLayer = window.dataLayer || [];

        // Clear previous ecommerce data
        window.dataLayer.push({
            ecommerce: null,
        });

        // Send GA4 view_item event
        window.dataLayer.push({
            event: "view_item",
            ecommerce: {
                currency: "KWD",
                value: Number(price.toFixed(3)),
                items: [
                    {
                        item_id: String(product._id),
                        item_name: itemName,
                        item_category: itemCategory,
                        price,
                        quantity: 1,
                    },
                ],
            },
        });
    }, [product, language]);
};

export default useViewItem;
