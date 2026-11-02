import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router";
import {
    Check,
    ChevronRight,
    CreditCard,
    MapPin,
    Pencil,
    ShoppingBag,
    Sparkles,
    TriangleAlert,
    Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import { useLanguage } from "@/context/LanguageContext";

/* ---------------------------------------------------------------- */
/* Constants & helpers                                              */
/* ---------------------------------------------------------------- */

// Cart page-এর hero ছবির সঙ্গে একই
const HERO_IMAGE =
    "https://images.unsplash.com/photo-1713774788222-78dde5aa19ff?auto=format&fit=crop&w=2000&q=80";

// value backend-এ যায় (ইংরেজি), ar শুধু দেখানোর জন্য
const governorates = [
    { value: "Al Asimah", ar: "العاصمة" },
    { value: "Hawalli", ar: "حولي" },
    { value: "Farwaniya", ar: "الفروانية" },
    { value: "Mubarak Al-Kabeer", ar: "مبارك الكبير" },
    { value: "Ahmadi", ar: "الأحمدي" },
    { value: "Jahra", ar: "الجهراء" },
];

const FIELD_LIMITS = {
    fullNameMin: 4,
    fullName: 30,
    area: 100,
    block: 50,
    street: 150,
    building: 50,
    floor: 50,
    apartmentNo: 50,
    notes: 300,
};

const MIN_ONLINE_TOTAL = 0.1;

const formatPrice = (price) => `${Number(price).toFixed(3)} KWD`;

const extractKuwaitLocalNumber = (phone = "") => {
    let digits = String(phone).replace(/\D/g, "");

    if (digits.startsWith("00965")) {
        digits = digits.slice(5);
    } else if (digits.startsWith("965") && digits.length > 8) {
        digits = digits.slice(3);
    }

    return digits.slice(0, 8);
};

const normalizeKuwaitPhone = (phone = "") => {
    const local = extractKuwaitLocalNumber(phone);

    return local ? `+965${local}` : "";
};

const isValidKuwaitPhone = (phone = "") => {
    return /^[2-9]\d{7}$/.test(extractKuwaitLocalNumber(phone));
};

const formatKuwaitPhoneForDisplay = (phone = "") => {
    const local = extractKuwaitLocalNumber(phone);

    if (local.length !== 8) {
        return phone;
    }

    return `+965 ${local.slice(0, 4)} ${local.slice(4)}`;
};

const useTr = () => {
    const { language } = useLanguage();
    const isArabic = language === "ar";

    return {
        language,
        isArabic,
        tr: (en, ar) => (isArabic ? ar : en),
    };
};

const eyebrowText =
    "text-[10px] font-semibold uppercase tracking-[0.17em] text-ink rtl:text-xs rtl:tracking-normal";

const solidButton =
    "inline-flex h-11 cursor-pointer items-center justify-center gap-2.5 rounded-none border border-primary bg-primary px-5 text-[11px] font-semibold uppercase tracking-[0.15em] text-cream transition-colors hover:border-pink hover:bg-pink disabled:pointer-events-none disabled:opacity-40 rtl:tracking-normal";

const outlineButton =
    "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-none border border-primary/40 bg-transparent px-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary transition-colors hover:border-primary hover:bg-blush disabled:pointer-events-none disabled:opacity-40 rtl:tracking-normal";

const inputClass =
    "h-11 rounded-none border-ink/20 bg-white text-sm text-ink shadow-none placeholder:text-ink/40 focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/10";

/* ---------------------------------------------------------------- */
/* Hero (Cart page-এর মতো)                                          */
/* ---------------------------------------------------------------- */

const CheckoutHero = ({ title, description, count }) => {
    const { tr } = useTr();

    return (
        <section className="relative isolate overflow-hidden bg-ink text-cream">
            <img
                src={HERO_IMAGE}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 -z-20 size-full object-cover object-center"
            />

            <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(59,32,38,0.62)_0%,rgba(59,32,38,0.93)_100%)]" />

            <div className="wrapper py-7 md:py-10">
                <nav
                    aria-label="Breadcrumb"
                    className="mb-4 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-cream/60 rtl:text-xs rtl:tracking-normal"
                >
                    <Link to="/" className="transition-colors hover:text-cream">
                        {tr("Home", "الرئيسية")}
                    </Link>

                    <ChevronRight className="size-3 rtl:rotate-180" />

                    <Link
                        to="/cart"
                        className="transition-colors hover:text-cream"
                    >
                        {tr("Cart", "السلة")}
                    </Link>

                    <ChevronRight className="size-3 rtl:rotate-180" />

                    <span className="text-cream">
                        {tr("Checkout", "إتمام الطلب")}
                    </span>
                </nav>

                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <h1 className="mt-3 font-display text-[28px] font-semibold leading-[1.08] tracking-[-0.045em] text-cream md:text-4xl rtl:tracking-normal">
                            {title}
                        </h1>

                        <p className="mt-2.5 max-w-md text-xs leading-relaxed text-cream/75 md:text-sm">
                            {description}
                        </p>
                    </div>

                    {typeof count === "number" && (
                        <div className="flex items-center gap-3 self-start md:self-auto">
                            <span
                                dir="ltr"
                                className="font-display text-4xl font-semibold leading-none text-cream md:text-5xl"
                            >
                                {String(count).padStart(2, "0")}
                            </span>

                            <div className="flex flex-col gap-0.5 border-s border-cream/25 ps-3 text-[10px] font-semibold uppercase leading-tight tracking-[0.15em] rtl:text-xs rtl:tracking-normal">
                                <span className="text-cream">
                                    {tr("Items", "منتجات")}
                                </span>

                                <span className="text-cream/50">
                                    {tr("in your order", "في طلبك")}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

/* ---------------------------------------------------------------- */
/* Page                                                             */
/* ---------------------------------------------------------------- */

const Checkout = () => {
    const { language, isArabic, tr } = useTr();
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const selectedCakeIds = useMemo(
        () => location.state?.cakeIds ?? [],
        [location.state?.cakeIds],
    );

    const [savedAddress, setSavedAddress] = useState(null);
    const [address, setAddress] = useState({
        phone: "",
    });
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [placedOrder, setPlacedOrder] = useState(null);

    const {
        data: cartResponse,
        isLoading: isCartLoading,
        isError: isCartError,
    } = useGet({
        url: "/cart",
        queryKey: ["cart"],
        retry: false,
        enabled: selectedCakeIds.length > 0,
    });

    const { mutate: createOrder, isPending: isCreatingOrder } = usePost({
        url: "/order",
    });

    const { mutate: createPayment, isPending: isCreatingPayment } = usePost({
        url: "/payments",
    });

    const orderItems = useMemo(() => {
        const cartItems = cartResponse?.data?.items ?? [];

        return cartItems
            .filter((item) => {
                const cakeId =
                    typeof item.cake === "object" ? item.cake?._id : item.cake;

                return selectedCakeIds.includes(cakeId);
            })
            .map((item) => {
                const cake = item.cake;

                if (!cake || typeof cake !== "object") {
                    return null;
                }

                const imageUrl =
                    typeof cake.images?.[0] === "string"
                        ? cake.images[0]
                        : cake.images?.[0]?.url;

                const originalPrice = Number(cake.price ?? 0);

                const discountedPrice =
                    cake.discountedPrice !== undefined
                        ? Number(cake.discountedPrice)
                        : originalPrice;

                return {
                    id: cake._id,
                    name: cake.name,
                    imageUrl,
                    price: originalPrice,
                    discountedPrice,
                    quantity: item.quantity,
                };
            })
            .filter(Boolean);
    }, [cartResponse, selectedCakeIds]);

    const orderAddOns = useMemo(() => {
        const cartAddOns = cartResponse?.data?.addOns ?? [];

        return cartAddOns
            .map((item) => {
                const addOn = item.addOn;

                if (!addOn || typeof addOn !== "object") {
                    return null;
                }

                return {
                    id: addOn._id,
                    name: addOn.name,
                    imageUrl: addOn.imageUrl,
                    price: Number(addOn.price ?? 0),
                    quantity: item.quantity,
                };
            })
            .filter(Boolean);
    }, [cartResponse]);

    const cakesTotal = useMemo(
        () =>
            orderItems.reduce(
                (total, item) => total + item.discountedPrice * item.quantity,
                0,
            ),
        [orderItems],
    );

    const addOnsTotal = useMemo(
        () =>
            orderAddOns.reduce(
                (total, item) => total + item.price * item.quantity,
                0,
            ),
        [orderAddOns],
    );

    const subtotal = useMemo(
        () => cakesTotal + addOnsTotal,
        [cakesTotal, addOnsTotal],
    );

    const cakesCount = useMemo(
        () => orderItems.reduce((total, item) => total + item.quantity, 0),
        [orderItems],
    );

    const addOnsCount = useMemo(
        () => orderAddOns.reduce((total, item) => total + item.quantity, 0),
        [orderAddOns],
    );

    const itemsCount = useMemo(
        () => cakesCount + addOnsCount,
        [cakesCount, addOnsCount],
    );

    const deliveryFee = 0;

    const discount = useMemo(
        () =>
            orderItems.reduce(
                (total, item) =>
                    total + (item.price - item.discountedPrice) * item.quantity,
                0,
            ),
        [orderItems],
    );

    const totalPrice = useMemo(
        () => subtotal + deliveryFee,
        [subtotal, deliveryFee],
    );

    const updateAddress = (field, value) => {
        setAddress((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const handleOpenAddressModal = () => {
        setAddress(
            savedAddress
                ? {
                      ...savedAddress,

                      phone: extractKuwaitLocalNumber(savedAddress.phone),
                  }
                : {
                      phone: "",
                  },
        );

        setIsAddressModalOpen(true);
    };

    const handleSaveAddress = () => {
        const fullName = address.fullName?.trim();
        const localPhone = extractKuwaitLocalNumber(address.phone);
        const area = address.area?.trim();
        const block = address.block?.trim();
        const street = address.street?.trim();
        const building = address.building?.trim();
        const floor = address.floor?.trim();
        const apartmentNo = address.apartmentNo?.trim();
        const notes = address.notes?.trim();

        if (!fullName) {
            toast.error(
                tr("Please enter your full name.", "يرجى إدخال اسمك الكامل."),
            );
            return;
        }

        if (fullName.length < FIELD_LIMITS.fullNameMin) {
            toast.error(
                tr(
                    `Full name must be at least ${FIELD_LIMITS.fullNameMin} characters.`,
                    `يجب ألا يقل الاسم الكامل عن ${FIELD_LIMITS.fullNameMin} أحرف.`,
                ),
            );
            return;
        }

        if (fullName.length > FIELD_LIMITS.fullName) {
            toast.error(
                tr(
                    `Full name cannot exceed ${FIELD_LIMITS.fullName} characters.`,
                    `يجب ألا يزيد الاسم الكامل عن ${FIELD_LIMITS.fullName} حرفًا.`,
                ),
            );
            return;
        }

        if (!localPhone) {
            toast.error(
                tr(
                    "Please enter your phone number.",
                    "يرجى إدخال رقم هاتفك.",
                ),
            );
            return;
        }

        if (!isValidKuwaitPhone(localPhone)) {
            toast.error(
                tr(
                    "Please enter a valid 8-digit Kuwait phone number.",
                    "يرجى إدخال رقم هاتف كويتي صحيح من 8 أرقام.",
                ),
            );
            return;
        }

        if (!address.governorate) {
            toast.error(
                tr(
                    "Please select your governorate.",
                    "يرجى اختيار المحافظة.",
                ),
            );
            return;
        }

        if (!area) {
            toast.error(tr("Please enter your area.", "يرجى إدخال المنطقة."));
            return;
        }

        if (!block) {
            toast.error(tr("Please enter your block.", "يرجى إدخال القطعة."));
            return;
        }

        if (!street) {
            toast.error(tr("Please enter your street.", "يرجى إدخال الشارع."));
            return;
        }

        if (!building) {
            toast.error(
                tr(
                    "Please enter your building number.",
                    "يرجى إدخال رقم المبنى.",
                ),
            );
            return;
        }

        setSavedAddress({
            fullName,
            phone: normalizeKuwaitPhone(localPhone),
            governorate: address.governorate,
            area,
            block,
            street,
            building,
            ...(floor ? { floor } : {}),
            ...(apartmentNo ? { apartmentNo } : {}),
            ...(notes ? { notes } : {}),
        });

        setIsAddressModalOpen(false);
    };

    const handlePlaceOrder = () => {
        if (!savedAddress) {
            toast.error(
                tr(
                    "Please add a delivery address.",
                    "يرجى إضافة عنوان التوصيل.",
                ),
            );
            return;
        }

        if (!paymentMethod) {
            toast.error(
                tr(
                    "Please select a payment method.",
                    "يرجى اختيار طريقة الدفع.",
                ),
            );
            return;
        }

        if (!selectedCakeIds.length) {
            toast.error(
                tr(
                    "No cakes selected for checkout.",
                    "لم يتم اختيار أي كعكة للدفع.",
                ),
            );
            navigate("/cart");
            return;
        }

        if (paymentMethod === "online" && totalPrice < MIN_ONLINE_TOTAL) {
            toast.error(
                tr(
                    "Online payment needs a minimum of 0.100 KWD. Please add items or choose cash on delivery.",
                    "الدفع الإلكتروني يتطلب حدًا أدنى 0.100 د.ك. يرجى إضافة منتجات أو اختيار الدفع عند الاستلام.",
                ),
            );
            return;
        }

        const payload = {
            cakeIds: selectedCakeIds,
            addOns: orderAddOns.map((item) => ({
                addOnId: item.id,
                quantity: item.quantity,
            })),
            shippingAddress: savedAddress,
            paymentMethod,
        };

        createOrder(payload, {
            onSuccess: (response) => {
                const order = response?.data;

                if (!order?._id) {
                    toast.error(
                        tr(
                            "Order was created, but the order ID is missing.",
                            "تم إنشاء الطلب لكن رقم الطلب مفقود.",
                        ),
                    );
                    return;
                }

                if (paymentMethod === "cash_on_delivery") {
                    setPlacedOrder(order);
                    setOrderPlaced(true);

                    // Clear the client-side cart cache so the navbar badge
                    // updates immediately after the order is placed.
                    queryClient.invalidateQueries({ queryKey: ["cart"] });

                    toast.success(
                        response?.message ||
                            tr(
                                "Order placed successfully.",
                                "تم تقديم الطلب بنجاح.",
                            ),
                    );

                    return;
                }

                createPayment(
                    {
                        orderId: order._id,
                    },
                    {
                        onSuccess: (paymentResponse) => {
                            const paymentUrl =
                                paymentResponse?.data?.paymentUrl;

                            if (!paymentUrl) {
                                toast.error(
                                    tr(
                                        "Payment was created, but the payment URL is missing.",
                                        "تم إنشاء الدفع لكن رابط الدفع مفقود.",
                                    ),
                                );
                                return;
                            }

                            window.location.href = paymentUrl;
                        },

                        onError: (error) => {
                            const message =
                                error?.response?.data?.message ||
                                tr(
                                    "Unable to initialize payment. Please try again.",
                                    "تعذر بدء عملية الدفع. يرجى المحاولة مرة أخرى.",
                                );

                            toast.error(message);
                        },
                    },
                );
            },

            onError: (error) => {
                const message =
                    error?.response?.data?.message ||
                    tr(
                        "Unable to place your order. Please try again.",
                        "تعذر تقديم طلبك. يرجى المحاولة مرة أخرى.",
                    );

                toast.error(message);
            },
        });
    };

    /* ------------------------------ States ------------------------------ */

    if (!selectedCakeIds.length) {
        return (
            <main className="bg-cream pb-16 md:pb-0">
                <CheckoutHero
                    title={tr("Checkout", "إتمام الطلب")}
                    description={tr(
                        "Select items from your cart to continue.",
                        "اختر منتجات من سلتك للمتابعة.",
                    )}
                />

                <section className="py-10 md:py-14">
                    <div className="wrapper">
                        <StatusCard
                            icon={ShoppingBag}
                            eyebrow={tr("Checkout", "إتمام الطلب")}
                            title={tr(
                                "No items selected",
                                "لم يتم اختيار أي منتج",
                            )}
                            description={tr(
                                "Please select at least one cake from your cart before continuing to checkout.",
                                "يرجى اختيار كعكة واحدة على الأقل من سلتك قبل المتابعة إلى الدفع.",
                            )}
                        >
                            <button
                                type="button"
                                className={solidButton}
                                onClick={() => navigate("/cart")}
                            >
                                {tr("Back to cart", "العودة إلى السلة")}
                                <ChevronRight className="size-4 rtl:rotate-180" />
                            </button>
                        </StatusCard>
                    </div>
                </section>
            </main>
        );
    }

    if (orderPlaced) {
        return (
            <main className="bg-cream pb-16 md:pb-0">
                <CheckoutHero
                    title={tr("Thank you", "شكرًا لك")}
                    description={tr(
                        "Your order has been received.",
                        "لقد استلمنا طلبك.",
                    )}
                />

                <section className="py-10 md:py-14">
                    <div className="wrapper">
                        <StatusCard
                            icon={Check}
                            eyebrow={tr("Order placed", "تم تقديم الطلب")}
                            title={tr(
                                "Your order is confirmed",
                                "تم تأكيد طلبك",
                            )}
                            description={tr(
                                "Your order has been created successfully. We will continue with your selected payment and delivery flow.",
                                "تم إنشاء طلبك بنجاح. سنتابع معك بحسب طريقة الدفع والتوصيل التي اخترتها.",
                            )}
                        >
                            {placedOrder?.orderNumber && (
                                <div className="mb-6 w-full border border-dashed border-primary/30 bg-blush/30 px-4 py-3">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/60 rtl:text-xs rtl:tracking-normal">
                                        {tr("Order number", "رقم الطلب")}
                                    </p>

                                    <p
                                        dir="ltr"
                                        className="mt-1 font-display text-xl font-semibold text-primary"
                                    >
                                        {placedOrder.orderNumber}
                                    </p>
                                </div>
                            )}

                            <div className="flex w-full flex-col justify-center gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    className={solidButton}
                                    onClick={() => navigate("/")}
                                >
                                    {tr("Continue shopping", "متابعة التسوق")}
                                </button>

                                <button
                                    type="button"
                                    className={`${outlineButton} h-11`}
                                    onClick={() =>
                                        navigate("/dashboard/orders")
                                    }
                                >
                                    {tr("View orders", "عرض الطلبات")}
                                    <ChevronRight className="size-4 rtl:rotate-180" />
                                </button>
                            </div>
                        </StatusCard>
                    </div>
                </section>
            </main>
        );
    }

    const isLoading = isCartLoading;
    const hasError = isCartError;

    const hasMissingSelectedCake =
        !isCartLoading && orderItems.length !== selectedCakeIds.length;

    const isCheckoutReady =
        !isLoading &&
        !hasError &&
        !hasMissingSelectedCake &&
        orderItems.length > 0;

    const isProcessingOrder = isCreatingOrder || isCreatingPayment;

    const isOnlineDisabled = totalPrice < MIN_ONLINE_TOTAL;

    const missingSteps = [];

    if (!savedAddress) {
        missingSteps.push(tr("Add a delivery address", "أضف عنوان التوصيل"));
    }

    if (!paymentMethod) {
        missingSteps.push(tr("Choose a payment method", "اختر طريقة الدفع"));
    }

    return (
        <main className="bg-cream pb-16 md:pb-0">
            <CheckoutHero
                title={tr("Complete your order", "أكمل طلبك")}
                description={tr(
                    "Confirm your delivery details, choose a payment method, and review your order before placing it.",
                    "أكّد تفاصيل التوصيل، واختر طريقة الدفع، وراجع طلبك قبل تقديمه.",
                )}
                count={isLoading ? undefined : itemsCount}
            />

            {/* overflow-x-clip: sticky summary কাজ করার জন্য overflow-hidden নয় */}
            <section className="relative overflow-x-clip py-10 md:py-14">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-20 end-0 size-96 rounded-full bg-blush/40 blur-3xl"
                />

                <div className="wrapper relative">
                    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                        <div className="space-y-5">
                            {/* 01 Address */}
                            <SectionCard
                                number="01"
                                done={Boolean(savedAddress)}
                                title={tr("Delivery address", "عنوان التوصيل")}
                                description={tr(
                                    "Where should we deliver your order?",
                                    "أين نوصّل طلبك؟",
                                )}
                            >
                                {savedAddress ? (
                                    <SavedAddress
                                        address={savedAddress}
                                        onEdit={handleOpenAddressModal}
                                    />
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleOpenAddressModal}
                                        className="flex w-full cursor-pointer items-center gap-4 border border-dashed border-primary/40 bg-cream p-4 text-start transition-colors hover:border-primary hover:bg-blush/40 md:p-5"
                                    >
                                        <div className="grid size-10 shrink-0 place-items-center bg-primary text-cream">
                                            <MapPin className="size-5" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="font-display text-lg font-semibold text-ink">
                                                {tr(
                                                    "Add delivery address",
                                                    "إضافة عنوان التوصيل",
                                                )}
                                            </p>

                                            <p className="mt-0.5 text-xs text-ink/60">
                                                {tr(
                                                    "Enter the address where you want your cake delivered.",
                                                    "أدخل العنوان الذي تريد توصيل كعكتك إليه.",
                                                )}
                                            </p>
                                        </div>

                                        <ChevronRight className="size-5 shrink-0 text-primary rtl:rotate-180" />
                                    </button>
                                )}
                            </SectionCard>

                            {/* 02 Payment */}
                            <SectionCard
                                number="02"
                                done={Boolean(paymentMethod)}
                                title={tr("Payment method", "طريقة الدفع")}
                                description={tr(
                                    "Select one payment method to continue.",
                                    "اختر طريقة دفع واحدة للمتابعة.",
                                )}
                            >
                                <div
                                    role="radiogroup"
                                    aria-label={tr(
                                        "Payment method",
                                        "طريقة الدفع",
                                    )}
                                    className="grid gap-3 md:grid-cols-2"
                                >
                                    <PaymentCard
                                        value="online"
                                        selected={paymentMethod === "online"}
                                        disabled={isOnlineDisabled}
                                        onSelect={setPaymentMethod}
                                        icon={CreditCard}
                                        title={tr(
                                            "Online payment",
                                            "الدفع الإلكتروني",
                                        )}
                                        description={
                                            isOnlineDisabled
                                                ? tr(
                                                      "Needs a minimum total of 0.100 KWD.",
                                                      "يتطلب حدًا أدنى 0.100 د.ك.",
                                                  )
                                                : tr(
                                                      "Pay securely using MyFatoorah.",
                                                      "ادفع بأمان عبر MyFatoorah.",
                                                  )
                                        }
                                    />

                                    <PaymentCard
                                        value="cash_on_delivery"
                                        selected={
                                            paymentMethod === "cash_on_delivery"
                                        }
                                        onSelect={setPaymentMethod}
                                        icon={Wallet}
                                        title={tr(
                                            "Cash on delivery",
                                            "الدفع عند الاستلام",
                                        )}
                                        description={tr(
                                            "Pay when your order arrives.",
                                            "ادفع عند وصول طلبك.",
                                        )}
                                    />
                                </div>

                                {isOnlineDisabled && (
                                    <p className="mt-3 text-xs leading-relaxed text-ink/60">
                                        {tr(
                                            "Free orders can only use cash on delivery.",
                                            "الطلبات المجانية تدعم الدفع عند الاستلام فقط.",
                                        )}
                                    </p>
                                )}
                            </SectionCard>

                            {/* 03 Review */}
                            <SectionCard
                                number="03"
                                done={isCheckoutReady}
                                title={tr("Order review", "مراجعة الطلب")}
                                description={tr(
                                    "Check your cakes and extras before placing the order.",
                                    "راجع كعكاتك والإضافات قبل تقديم الطلب.",
                                )}
                            >
                                {isLoading ? (
                                    <ReviewSkeleton />
                                ) : hasError ? (
                                    <Notice tone="error">
                                        {tr(
                                            "Unable to load your selected items. Please go back to your cart and try again.",
                                            "تعذر تحميل المنتجات المحددة. يرجى العودة إلى السلة والمحاولة مرة أخرى.",
                                        )}
                                    </Notice>
                                ) : (
                                    <>
                                        {hasMissingSelectedCake && (
                                            <div className="mb-4">
                                                <Notice tone="error">
                                                    {tr(
                                                        "Some selected items are no longer in your cart. Please return to your cart and review it.",
                                                        "بعض المنتجات المحددة لم تعد في سلتك. يرجى العودة إلى السلة ومراجعتها.",
                                                    )}
                                                </Notice>
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            {orderItems.map((item) => (
                                                <OrderItem
                                                    key={item.id}
                                                    imageUrl={item.imageUrl}
                                                    name={
                                                        item.name?.[language] ??
                                                        item.name?.en
                                                    }
                                                    quantity={item.quantity}
                                                    price={item.discountedPrice}
                                                    originalPrice={item.price}
                                                />
                                            ))}
                                        </div>

                                        {orderAddOns.length > 0 && (
                                            <div className="mt-6 border-t border-ink/10 pt-5">
                                                <div className="mb-3 flex items-center justify-between gap-3">
                                                    <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary rtl:text-xs rtl:tracking-normal">
                                                        {tr(
                                                            "Add-ons",
                                                            "الإضافات",
                                                        )}
                                                    </h3>

                                                    <span className="text-[11px] text-ink/50">
                                                        {orderAddOns.length}{" "}
                                                        {tr("extras", "إضافات")}
                                                    </span>
                                                </div>

                                                <div className="space-y-3">
                                                    {orderAddOns.map((item) => (
                                                        <OrderItem
                                                            key={item.id}
                                                            imageUrl={
                                                                item.imageUrl
                                                            }
                                                            name={
                                                                item.name?.[
                                                                    language
                                                                ] ??
                                                                item.name?.en
                                                            }
                                                            quantity={
                                                                item.quantity
                                                            }
                                                            price={item.price}
                                                            compact
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </SectionCard>
                        </div>

                        {/* Summary */}
                        <aside className="xl:sticky xl:top-24">
                            <div className="overflow-hidden rounded-[14px] border border-ink/10 bg-white shadow-lg shadow-ink/5">
                                <div className="flex items-center justify-between gap-3 bg-primary px-5 py-5 text-cream md:px-6">
                                    <div>
                                        <h2 className="font-display text-xl font-semibold tracking-tight">
                                            {tr("Order summary", "ملخص الطلب")}
                                        </h2>

                                        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.13em] text-cream/70 rtl:text-xs rtl:tracking-normal">
                                            {tr(
                                                "Your order details",
                                                "تفاصيل طلبك",
                                            )}
                                        </p>
                                    </div>

                                    {itemsCount > 0 && (
                                        <span className="border border-cream/30 bg-cream/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-cream rtl:text-xs rtl:tracking-normal">
                                            {itemsCount}{" "}
                                            {isArabic
                                                ? "عنصر"
                                                : itemsCount === 1
                                                  ? "item"
                                                  : "items"}
                                        </span>
                                    )}
                                </div>

                                <div className="p-5 md:p-6">
                                    {itemsCount === 0 ? (
                                        <div className="py-6 text-center">
                                            <div className="mx-auto grid size-12 place-items-center border border-ink/10 bg-cream text-primary">
                                                <ShoppingBag className="size-5" />
                                            </div>

                                            <p className="mt-3 font-display text-lg font-semibold text-ink">
                                                {tr(
                                                    "No items to show yet",
                                                    "لا توجد منتجات بعد",
                                                )}
                                            </p>

                                            <p className="mt-1 text-xs text-ink/55">
                                                {tr(
                                                    "Your price breakdown will appear here.",
                                                    "ستظهر تفاصيل الأسعار هنا.",
                                                )}
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-3 text-sm">
                                                {orderItems.length > 0 && (
                                                    <SummaryRow
                                                        label={tr(
                                                            "Cakes",
                                                            "الكعكات",
                                                        )}
                                                        hint={`${cakesCount} ${tr("pcs", "قطعة")}`}
                                                        value={cakesTotal}
                                                    />
                                                )}

                                                {orderAddOns.length > 0 && (
                                                    <SummaryRow
                                                        label={tr(
                                                            "Add-ons",
                                                            "الإضافات",
                                                        )}
                                                        hint={`${addOnsCount} ${tr("pcs", "قطعة")}`}
                                                        value={addOnsTotal}
                                                    />
                                                )}

                                                <SummaryRow
                                                    label={tr(
                                                        "Delivery",
                                                        "التوصيل",
                                                    )}
                                                    value={deliveryFee}
                                                    free={deliveryFee === 0}
                                                />
                                            </div>

                                            {discount > 0 && (
                                                <div className="mt-4 flex items-center justify-between gap-3 border border-primary/15 bg-primary/[0.04] px-3 py-3">
                                                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-primary rtl:text-xs rtl:tracking-normal">
                                                        <Sparkles className="size-4" />
                                                        {tr(
                                                            "Total savings",
                                                            "إجمالي ما وفرته",
                                                        )}
                                                    </div>

                                                    <span
                                                        dir="ltr"
                                                        className="text-sm font-bold text-primary"
                                                    >
                                                        {formatPrice(discount)}
                                                    </span>
                                                </div>
                                            )}

                                            {deliveryFee === 0 && (
                                                <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-primary">
                                                    <Check className="size-3.5" />
                                                    {tr(
                                                        "You've unlocked free delivery.",
                                                        "لقد حصلت على توصيل مجاني.",
                                                    )}
                                                </p>
                                            )}
                                        </>
                                    )}

                                    <div className="my-5 border-t border-ink/10" />

                                    <div className="bg-cream p-4">
                                        <div className="flex items-end justify-between gap-3">
                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-ink/70 rtl:text-xs rtl:tracking-normal">
                                                    {tr("Total", "الإجمالي")}
                                                </p>

                                                <p className="mt-1 text-[11px] text-ink/55">
                                                    {tr(
                                                        "Including delivery",
                                                        "شامل التوصيل",
                                                    )}
                                                </p>
                                            </div>

                                            <span
                                                dir="ltr"
                                                className="font-display text-[26px] font-semibold leading-none tracking-[-0.04em] text-primary"
                                            >
                                                {formatPrice(totalPrice)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className={`${solidButton} mt-4 h-12 w-full`}
                                        disabled={
                                            !savedAddress ||
                                            !paymentMethod ||
                                            !isCheckoutReady ||
                                            isProcessingOrder
                                        }
                                        onClick={handlePlaceOrder}
                                    >
                                        {isCreatingOrder
                                            ? tr(
                                                  "Creating order...",
                                                  "جارٍ إنشاء الطلب...",
                                              )
                                            : isCreatingPayment
                                              ? tr(
                                                    "Redirecting to payment...",
                                                    "جارٍ التحويل إلى الدفع...",
                                                )
                                              : paymentMethod === "online"
                                                ? tr(
                                                      "Continue to payment",
                                                      "المتابعة إلى الدفع",
                                                  )
                                                : tr(
                                                      "Place order",
                                                      "تقديم الطلب",
                                                  )}

                                        {!isProcessingOrder && (
                                            <ChevronRight className="size-4 rtl:rotate-180" />
                                        )}
                                    </button>

                                    {missingSteps.length > 0 &&
                                        !isProcessingOrder && (
                                            <ul className="mt-3 space-y-1.5">
                                                {missingSteps.map((step) => (
                                                    <li
                                                        key={step}
                                                        className="flex items-center gap-2 text-[11px] text-ink/60"
                                                    >
                                                        <span className="size-1.5 shrink-0 bg-pink" />
                                                        {step}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                    <p className="mt-4 text-center text-[11px] leading-relaxed text-ink/50">
                                        {tr(
                                            "By placing your order, you agree to our terms and delivery policy.",
                                            "بتقديم طلبك، فإنك توافق على الشروط وسياسة التوصيل.",
                                        )}
                                    </p>

                                    <Link
                                        to="/cart"
                                        className="mt-3 block text-center text-[11px] font-semibold text-primary underline-offset-4 hover:underline"
                                    >
                                        {tr("Back to cart", "العودة إلى السلة")}
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>

                    <AddressModal
                        open={isAddressModalOpen}
                        onOpenChange={setIsAddressModalOpen}
                        address={address}
                        onChange={updateAddress}
                        onSave={handleSaveAddress}
                        governorates={governorates}
                        hasSavedAddress={Boolean(savedAddress)}
                    />
                </div>
            </section>
        </main>
    );
};

/* ---------------------------------------------------------------- */
/* Layout pieces                                                    */
/* ---------------------------------------------------------------- */

const StatusCard = ({ icon: Icon, eyebrow, title, description, children }) => {
    return (
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-[14px] border border-ink/10 bg-white px-6 py-12 text-center md:px-10 md:py-14">
            <div className="grid size-14 place-items-center bg-primary text-cream">
                <Icon className="size-6" />
            </div>

            <div className="mt-6 flex items-center gap-3">
                <span className="h-px w-6 bg-primary" />

                <span className={eyebrowText}>{eyebrow}</span>

                <span className="h-px w-6 bg-primary" />
            </div>

            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-[-0.04em] text-primary rtl:tracking-normal md:text-4xl">
                {title}
            </h2>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70">
                {description}
            </p>

            <div className="mt-8 flex w-full flex-col items-center">
                {children}
            </div>
        </div>
    );
};

const SectionCard = ({ number, title, description, done, children }) => {
    return (
        <section className="rounded-[14px] border border-ink/10 bg-white p-5 md:p-6">
            <div className="mb-5 flex items-start gap-3.5">
                <div
                    className={`grid size-9 shrink-0 place-items-center border text-[11px] font-semibold transition-colors ${
                        done
                            ? "border-primary bg-primary text-cream"
                            : "border-ink/25 bg-white text-ink"
                    }`}
                >
                    {done ? <Check className="size-4" /> : number}
                </div>

                <div className="min-w-0">
                    <h2 className="font-display text-xl font-semibold leading-tight text-primary">
                        {title}
                    </h2>

                    <p className="mt-1 text-xs leading-relaxed text-ink/60">
                        {description}
                    </p>
                </div>
            </div>

            {children}
        </section>
    );
};

const Notice = ({ tone = "info", children }) => {
    return (
        <div
            className={`flex items-start gap-2.5 border px-3.5 py-3 text-xs leading-relaxed ${
                tone === "error"
                    ? "border-primary/30 bg-primary/5 text-primary"
                    : "border-ink/10 bg-cream text-ink/70"
            }`}
        >
            <TriangleAlert className="mt-px size-4 shrink-0" />

            <p>{children}</p>
        </div>
    );
};

const ReviewSkeleton = () => {
    return (
        <div className="space-y-3" aria-hidden="true">
            {[0, 1].map((key) => (
                <div
                    key={key}
                    className="flex animate-pulse items-center gap-3 border border-ink/10 bg-cream p-3"
                >
                    <div className="size-16 shrink-0 rounded-[10px] bg-blush/60" />

                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-2/3 bg-ink/10" />
                        <div className="h-3 w-1/3 bg-ink/10" />
                    </div>

                    <div className="h-4 w-16 bg-ink/10" />
                </div>
            ))}
        </div>
    );
};

/* ---------------------------------------------------------------- */
/* Address                                                          */
/* ---------------------------------------------------------------- */

const SavedAddress = ({ address, onEdit }) => {
    const { isArabic, tr } = useTr();

    const governorateLabel =
        governorates.find((g) => g.value === address.governorate)?.[
            isArabic ? "ar" : "value"
        ] ?? address.governorate;

    return (
        <div className="border border-primary/25 bg-blush/30 p-4 md:p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="min-w-0 space-y-1.5 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="grid size-5 place-items-center bg-primary text-cream">
                            <Check className="size-3" />
                        </span>

                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary rtl:text-xs rtl:tracking-normal">
                            {tr("Saved address", "العنوان المحفوظ")}
                        </span>
                    </div>

                    <p className="pt-1 font-display text-lg font-semibold text-ink">
                        {address.fullName}
                    </p>

                    <p className="text-ink/70">
                        <span dir="ltr" className="inline-block">
                            {formatKuwaitPhoneForDisplay(address.phone)}
                        </span>
                    </p>

                    <p className="leading-relaxed text-ink/70">
                        {address.area} · {tr("Block", "قطعة")} {address.block} ·{" "}
                        {address.street}
                    </p>

                    <p className="leading-relaxed text-ink/70">
                        {tr("Building", "مبنى")} {address.building}
                        {address.floor &&
                            `, ${tr("Floor", "الطابق")} ${address.floor}`}
                        {address.apartmentNo &&
                            `, ${tr("Apartment", "شقة")} ${address.apartmentNo}`}
                        , {governorateLabel}
                    </p>

                    {address.notes && (
                        <p className="pt-1 text-xs text-ink/55">
                            {tr("Note", "ملاحظة")}: {address.notes}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    className={`${outlineButton} shrink-0`}
                    onClick={onEdit}
                >
                    <Pencil className="size-3.5" />
                    {tr("Edit address", "تعديل العنوان")}
                </button>
            </div>
        </div>
    );
};

const AddressModal = ({
    open,
    onOpenChange,
    address,
    onChange,
    onSave,
    governorates,
    hasSavedAddress,
}) => {
    const { isArabic, tr } = useTr();

    const notesLength = (address.notes || "").length;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] !max-w-2xl overflow-y-auto rounded-[14px] border border-ink/10 bg-cream p-5 md:p-7">
                <DialogHeader className="text-start">
                    <DialogTitle className="font-display text-2xl font-semibold text-primary">
                        {hasSavedAddress
                            ? tr("Edit delivery address", "تعديل عنوان التوصيل")
                            : tr("Add delivery address", "إضافة عنوان التوصيل")}
                    </DialogTitle>

                    <DialogDescription className="text-xs leading-relaxed text-ink/60">
                        {hasSavedAddress
                            ? tr(
                                  "Update your saved address. The new address will replace the existing one.",
                                  "حدّث عنوانك المحفوظ. سيحل العنوان الجديد محل العنوان الحالي.",
                              )
                            : tr(
                                  "Enter the address where you want your order delivered.",
                                  "أدخل العنوان الذي تريد توصيل طلبك إليه.",
                              )}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-2 space-y-6">
                    {/* Contact */}
                    <fieldset className="space-y-4">
                        <GroupTitle>
                            {tr("Contact", "بيانات التواصل")}
                        </GroupTitle>

                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                label={tr("Full name", "الاسم الكامل")}
                                required
                            >
                                <Input
                                    className={inputClass}
                                    value={address.fullName || ""}
                                    onChange={(event) =>
                                        onChange("fullName", event.target.value)
                                    }
                                    placeholder={tr(
                                        "Enter your full name",
                                        "أدخل اسمك الكامل",
                                    )}
                                    maxLength={FIELD_LIMITS.fullName}
                                />
                            </FormField>

                            <FormField
                                label={tr("Phone number", "رقم الهاتف")}
                                required
                            >
                                <div
                                    dir="ltr"
                                    className="flex h-11 items-stretch overflow-hidden border border-ink/20 bg-white transition focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/10"
                                >
                                    <span className="flex items-center border-e border-ink/15 bg-blush/40 px-3 text-sm font-semibold text-primary">
                                        +965
                                    </span>

                                    <Input
                                        type="tel"
                                        inputMode="numeric"
                                        autoComplete="tel-national"
                                        className="h-full flex-1 rounded-none border-0 bg-transparent text-start text-sm text-ink shadow-none placeholder:text-ink/40 focus-visible:ring-0"
                                        value={address.phone || ""}
                                        onChange={(event) =>
                                            onChange(
                                                "phone",
                                                extractKuwaitLocalNumber(
                                                    event.target.value,
                                                ),
                                            )
                                        }
                                        placeholder="9123 4567"
                                    />
                                </div>
                            </FormField>
                        </div>
                    </fieldset>

                    {/* Location */}
                    <fieldset className="space-y-4">
                        <GroupTitle>
                            {tr("Delivery location", "موقع التوصيل")}
                        </GroupTitle>

                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                label={tr("Governorate", "المحافظة")}
                                required
                            >
                                <Select
                                    value={address.governorate || ""}
                                    onValueChange={(value) =>
                                        onChange("governorate", value)
                                    }
                                >
                                    <SelectTrigger
                                        className={`${inputClass} w-full`}
                                    >
                                        <SelectValue
                                            placeholder={tr(
                                                "Select governorate",
                                                "اختر المحافظة",
                                            )}
                                        />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {governorates.map((governorate) => (
                                            <SelectItem
                                                key={governorate.value}
                                                value={governorate.value}
                                            >
                                                {isArabic
                                                    ? governorate.ar
                                                    : governorate.value}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>

                            <FormField label={tr("Area", "المنطقة")} required>
                                <Input
                                    className={inputClass}
                                    value={address.area || ""}
                                    onChange={(event) =>
                                        onChange("area", event.target.value)
                                    }
                                    placeholder={tr(
                                        "e.g. Salmiya",
                                        "مثال: السالمية",
                                    )}
                                    maxLength={FIELD_LIMITS.area}
                                />
                            </FormField>

                            <FormField label={tr("Block", "القطعة")} required>
                                <Input
                                    className={inputClass}
                                    value={address.block || ""}
                                    onChange={(event) =>
                                        onChange("block", event.target.value)
                                    }
                                    placeholder={tr(
                                        "Block number",
                                        "رقم القطعة",
                                    )}
                                    maxLength={FIELD_LIMITS.block}
                                />
                            </FormField>

                            <FormField label={tr("Street", "الشارع")} required>
                                <Input
                                    className={inputClass}
                                    value={address.street || ""}
                                    onChange={(event) =>
                                        onChange("street", event.target.value)
                                    }
                                    placeholder={tr(
                                        "Street name",
                                        "اسم الشارع",
                                    )}
                                    maxLength={FIELD_LIMITS.street}
                                />
                            </FormField>

                            <FormField
                                label={tr("Building", "المبنى")}
                                required
                            >
                                <Input
                                    className={inputClass}
                                    value={address.building || ""}
                                    onChange={(event) =>
                                        onChange("building", event.target.value)
                                    }
                                    placeholder={tr(
                                        "Building number",
                                        "رقم المبنى",
                                    )}
                                    maxLength={FIELD_LIMITS.building}
                                />
                            </FormField>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField label={tr("Floor", "الطابق")}>
                                    <Input
                                        className={inputClass}
                                        value={address.floor || ""}
                                        onChange={(event) =>
                                            onChange(
                                                "floor",
                                                event.target.value,
                                            )
                                        }
                                        placeholder={tr("Optional", "اختياري")}
                                        maxLength={FIELD_LIMITS.floor}
                                    />
                                </FormField>

                                <FormField label={tr("Apartment", "الشقة")}>
                                    <Input
                                        className={inputClass}
                                        value={address.apartmentNo || ""}
                                        onChange={(event) =>
                                            onChange(
                                                "apartmentNo",
                                                event.target.value,
                                            )
                                        }
                                        placeholder={tr("Optional", "اختياري")}
                                        maxLength={FIELD_LIMITS.apartmentNo}
                                    />
                                </FormField>
                            </div>
                        </div>
                    </fieldset>

                    {/* Notes */}
                    <fieldset className="space-y-4">
                        <GroupTitle>{tr("Notes", "ملاحظات")}</GroupTitle>

                        <FormField
                            label={tr("Delivery notes", "ملاحظات التوصيل")}
                        >
                            <Textarea
                                value={address.notes || ""}
                                onChange={(event) =>
                                    onChange("notes", event.target.value)
                                }
                                placeholder={tr(
                                    "Any instructions for the delivery driver?",
                                    "هل لديك تعليمات لسائق التوصيل؟",
                                )}
                                className="min-h-24 resize-none rounded-none border-ink/20 bg-white text-sm text-ink shadow-none placeholder:text-ink/40 focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/10"
                                maxLength={FIELD_LIMITS.notes}
                            />

                            <p
                                dir="ltr"
                                className="text-end text-[10px] text-ink/40"
                            >
                                {notesLength}/{FIELD_LIMITS.notes}
                            </p>
                        </FormField>
                    </fieldset>

                    <div className="flex flex-col-reverse gap-2 border-t border-ink/10 pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            className={`${outlineButton} h-11 px-6`}
                            onClick={() => onOpenChange(false)}
                        >
                            {tr("Cancel", "إلغاء")}
                        </button>

                        <button
                            type="button"
                            className={solidButton}
                            onClick={onSave}
                        >
                            <Check className="size-4" />
                            {tr("Save address", "حفظ العنوان")}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const GroupTitle = ({ children }) => {
    return (
        <legend className="flex w-full items-center gap-3">
            <span className="h-px w-6 bg-primary" />

            <span className={eyebrowText}>{children}</span>
        </legend>
    );
};

const FormField = ({ label, required, children }) => {
    return (
        <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-ink">
                {label}

                {required && <span className="ms-1 text-primary">*</span>}
            </span>

            {children}
        </label>
    );
};

/* ---------------------------------------------------------------- */
/* Payment                                                          */
/* ---------------------------------------------------------------- */

const PaymentCard = ({
    value,
    selected,
    disabled = false,
    onSelect,
    icon: Icon,
    title,
    description,
}) => {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onSelect(value)}
            className={`relative flex min-h-28 w-full cursor-pointer items-start gap-3.5 border p-4 text-start transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                selected
                    ? "border-primary bg-blush/30"
                    : "border-ink/15 bg-white hover:border-primary/50 hover:bg-blush/20"
            }`}
        >
            <div
                className={`grid size-10 shrink-0 place-items-center transition-colors ${
                    selected
                        ? "bg-primary text-cream"
                        : "bg-blush/50 text-primary"
                }`}
            >
                <Icon className="size-4" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="font-display text-base font-semibold text-ink">
                    {title}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-ink/60">
                    {description}
                </p>
            </div>

            <div
                aria-hidden="true"
                className={`grid size-5 shrink-0 place-items-center border transition-colors ${
                    selected
                        ? "border-primary bg-primary text-cream"
                        : "border-ink/25 bg-white"
                }`}
            >
                {selected && <Check className="size-3" />}
            </div>
        </button>
    );
};

/* ---------------------------------------------------------------- */
/* Order items & summary                                            */
/* ---------------------------------------------------------------- */

const OrderItem = ({
    imageUrl,
    name,
    quantity,
    price,
    originalPrice,
    compact = false,
}) => {
    const hasDiscount =
        originalPrice !== undefined && Number(originalPrice) > Number(price);

    const discountPercentage = hasDiscount
        ? Math.round(
              ((Number(originalPrice) - Number(price)) /
                  Number(originalPrice)) *
                  100,
          )
        : 0;

    return (
        <div className="flex items-center gap-3 border border-ink/10 bg-cream/60 p-3">
            {imageUrl && (
                <div
                    className={`shrink-0 overflow-hidden rounded-[10px] bg-blush/50 ${
                        compact ? "size-12" : "size-16"
                    }`}
                >
                    <img
                        src={imageUrl}
                        alt={name}
                        className="size-full object-cover"
                    />
                </div>
            )}

            <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base font-semibold text-ink">
                    {name}
                </p>

                <div
                    dir="ltr"
                    className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs rtl:justify-end"
                >
                    <span className="text-ink/60">
                        {formatPrice(price)} × {quantity}
                    </span>

                    {hasDiscount && (
                        <>
                            <span className="text-[11px] text-ink/40 line-through">
                                {formatPrice(originalPrice)}
                            </span>

                            <span className="bg-primary px-1.5 py-0.5 text-[9px] font-semibold text-cream">
                                -{discountPercentage}%
                            </span>
                        </>
                    )}
                </div>
            </div>

            <p
                dir="ltr"
                className="shrink-0 font-display text-base font-semibold text-ink"
            >
                {formatPrice(price * quantity)}
            </p>
        </div>
    );
};

const SummaryRow = ({ label, value, hint, free = false }) => {
    const { tr } = useTr();

    return (
        <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-ink/70">
                {label}

                {hint && (
                    <span className="text-[11px] font-medium text-ink/45">
                        ({hint})
                    </span>
                )}
            </span>

            {free ? (
                <span className="bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-cream rtl:text-xs rtl:tracking-normal">
                    {tr("Free", "مجاني")}
                </span>
            ) : (
                <span dir="ltr" className="font-semibold text-ink">
                    {formatPrice(value)}
                </span>
            )}
        </div>
    );
};

export default Checkout;