import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import useAuth from "@/hooks/useAuth";

/**
 * SHA-256 hash helper using Web Crypto API (browser native).
 * Returns a lowercase hex string.
 */
const sha256Hex = async (input) => {
    if (!input) return "";
    const buf = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(input.trim().toLowerCase()),
    );
    return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
};

const usePurchase = ({
    order,
    customerInfo = {},
    orderCount = 0,
    orderMetadata = {},
}) => {
    const { language = "en" } = useLanguage();
    const { user: authUser } = useAuth();
    const [isHashing, setIsHashing] = useState(false);

    // Determine new vs returning based on actual order history count
    const isNewCustomer = orderCount === 0;

    useEffect(() => {
        if (!order?.orderNumber) return;

        const isOnlinePaid = order.paymentStatus === "paid";
        const isCompletedCOD = order.paymentMethod === "cash_on_delivery";

        if (!isOnlinePaid && !isCompletedCOD) return;

        if (typeof window === "undefined") return;

        const flagKey = `ga4_purchase_fired_${order.orderNumber}`;

        try {
            if (window.sessionStorage.getItem(flagKey)) return;
        } catch {
            // Continue tracking if sessionStorage is unavailable.
        }

        const getItemId = (item) => {
            const id = item?._id ?? item?.id ?? item;

            return id ? String(id) : null;
        };

        // Resolve customer info from params, then auth user, then order address
        const resolvedEmail =
            customerInfo.email || authUser?.email || "";
        const resolvedFirstName =
            customerInfo.firstName ||
            (authUser?.username ? authUser.username.split(" ")[0] : "") ||
            (order.shippingAddress?.fullName
                ? order.shippingAddress.fullName.split(" ")[0]
                : "") ||
            "";
        const resolvedLastName =
            customerInfo.lastName ||
            (authUser?.username
                ? authUser.username.split(" ").slice(1).join(" ") || ""
                : "") ||
            (order.shippingAddress?.fullName
                ? order.shippingAddress.fullName.split(" ").slice(1).join(" ") ||
                  ""
                : "") ||
            "";
        const resolvedPhone =
            customerInfo.phone ||
            order.shippingAddress?.phone ||
            authUser?.phone ||
            "";

        const billingAddress1 = order.shippingAddress?.street || "";
        const billingAddress2 =
            order.shippingAddress?.block ||
            order.shippingAddress?.building ||
            "";
        const billingCity = order.shippingAddress?.area || "";
        const billingState = order.shippingAddress?.governorate || "";
        const billingPostcode = "";
        const billingCountry = "KW";

        // Shipping address mirrors billing (single-address checkout flow)
        const shippingAddress1 = billingAddress1;
        const shippingAddress2 = billingAddress2;
        const shippingCity = billingCity;
        const shippingState = billingState;
        const shippingPostcode = billingPostcode;
        const shippingCountry = billingCountry;

        const formatItem = (item, reference, fallbackName) => {
            const itemId = getItemId(item?.[reference]);

            if (!itemId) return null;

            const price = Number(item.price);
            const quantity = Number(item.quantity);

            if (!Number.isFinite(price) || price < 0) return null;
            if (!Number.isFinite(quantity) || quantity <= 0) return null;

            const cake = item.cake;
            const addOn = item.addOn;

            let itemCategory = "";
            let stockStatus = "instock";
            let stockLevel = null;

            if (cake) {
                itemCategory = cake.category ? String(cake.category) : "";
            } else if (addOn) {
                itemCategory = "add-on";
            }

            return {
                google_business_vertical: "retail",
                id: itemId,
                item_category: itemCategory,
                item_id: itemId,
                item_name:
                    item.name?.[language] ||
                    item.name?.en ||
                    fallbackName,
                price: Number(price.toFixed(3)),
                quantity,
                sku: itemId,
                stocklevel: stockLevel,
                stockstatus: stockStatus,
            };
        };

        const items = [
            ...(Array.isArray(order.items)
                ? order.items
                      .map((item) =>
                          formatItem(item, "cake", "Unknown product"),
                      )
                      .filter(Boolean)
                : []),

            ...(Array.isArray(order.addOns)
                ? order.addOns
                      .map((item) =>
                          formatItem(item, "addOn", "Unknown add-on"),
                      )
                      .filter(Boolean)
                : []),
        ];

        if (items.length === 0) return;

        const value = Number(order.totalPrice);
        const subtotal = Number(order.subtotal || 0);
        const discount = Number(order.discount || 0);
        const deliveryFee = Number(order.deliveryFee || 0);
        const tax = 0;

        if (!Number.isFinite(value) || value <= 0) return;

        window.dataLayer = window.dataLayer || [];

        const transactionId = String(order.orderNumber);
        const currency = "KWD";

        const orderDate = order.createdAt
            ? new Date(order.createdAt).toISOString()
            : new Date().toISOString();

        const paymentMethodTitle =
            order.paymentMethod === "cash_on_delivery"
                ? "Cash on delivery"
                : "Online payment";

        // 1. Clear previous ecommerce data
        window.dataLayer.push({
            ecommerce: null,
        });

        // 2. Compute SHA-256 hashes for customer PII fields
        const computeHashes = async () => {
            setIsHashing(true);
            try {
                const [
                    emailHash,
                    firstNameHash,
                    lastNameHash,
                    phoneHash,
                ] = await Promise.all([
                    sha256Hex(resolvedEmail),
                    sha256Hex(resolvedFirstName),
                    sha256Hex(resolvedLastName),
                    sha256Hex(resolvedPhone),
                ]);

                // 3. Push the enhanced purchase event
                window.dataLayer.push({
                    event: "purchase",
                    customer_type: isNewCustomer ? "new" : "returning",
                    ecommerce: {
                        affiliation: "",
                        coupon: "",
                        currency,
                        items,
                        shipping: deliveryFee,
                        tax,
                        transaction_id: transactionId,
                        value: Number(value.toFixed(3)),
                    },
                    new_customer: isNewCustomer,
            orderData: {
                attributes: {},
                coupons: "",
                date: orderDate,
                order_number: transactionId,
                payment_method:
                    order.paymentMethod === "cash_on_delivery"
                        ? "cod"
                        : "online",
                payment_method_title: paymentMethodTitle,
                shipping_method: "",
                status: order.orderStatus || "pending",
                customer: {
                    billing: {
                        address_1: billingAddress1,
                        address_2: billingAddress2,
                        city: billingCity,
                        company: "",
                        country: billingCountry,
                        email: resolvedEmail,
                        email_hash: emailHash,
                        first_name: resolvedFirstName,
                        first_name_hash: firstNameHash,
                        last_name: resolvedLastName,
                        last_name_hash: lastNameHash,
                        phone: resolvedPhone,
                        phone_hash: phoneHash,
                        postcode: billingPostcode,
                        state: billingState,
                    },
                    shipping: {
                        address_1: shippingAddress1,
                        address_2: shippingAddress2,
                        city: shippingCity,
                        company: "",
                        country: shippingCountry,
                        email: resolvedEmail,
                        email_hash: emailHash,
                        first_name: resolvedFirstName,
                        first_name_hash: firstNameHash,
                        last_name: resolvedLastName,
                        last_name_hash: lastNameHash,
                        phone: resolvedPhone,
                        phone_hash: phoneHash,
                        postcode: shippingPostcode,
                        state: shippingState,
                    },
                },
                items: items.map((item) => ({
                    google_business_vertical: "retail",
                    id: item.id,
                    item_category: item.item_category,
                    item_id: item.item_id,
                    item_name: item.item_name,
                    price: item.price,
                    quantity: item.quantity,
                    sku: item.sku,
                    stocklevel: item.stocklevel,
                    stockstatus: item.stockstatus,
                })),
                shipping: deliveryFee,
                tax,
                totals: {
                    cart_tax: tax,
                    currency,
                    discount_tax: 0,
                    discount_total: discount,
                    shipping_tax: 0,
                    shipping_total: deliveryFee,
                    subtotal: Number(subtotal.toFixed(3)),
                },
            },
            shipping: deliveryFee,
            tax,
        });
            } catch (error) {
                console.error("GA4 purchase hash computation failed:", error);
            } finally {
                setIsHashing(false);
            }
        };

        void computeHashes();

        try {
            window.sessionStorage.setItem(flagKey, "true");
        } catch {
            // Duplicate prevention may be unavailable if storage is blocked.
        }
    }, [
        order,
        language,
        customerInfo,
        orderCount,
        orderMetadata,
        authUser,
        isNewCustomer,
    ]);
};

export default usePurchase;
