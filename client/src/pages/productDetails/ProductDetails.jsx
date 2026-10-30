import { useState } from "react";
import {
    ChevronRight,
    Clock3,
    Flame,
    Loader2,
    Minus,
    PackageCheck,
    Plus,
    ShoppingCart,
    Star,
    Tag,
    Users,
} from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import useGet from "@/hooks/useGet";
import useAddToCart from "@/hooks/useAddToCart";
import useAuth from "@/hooks/useAuth";
import { useGetMyCakeReview } from "@/hooks/useReviews";

import ProductGallery from "./ProductGallery";
import ProductAddOns from "./ProductAddOns";
import ProductReviews from "./ProductReviews";
import ReviewFormModal from "./ReviewFormModal";
import { normalizeFlavors } from "@/utils/flavor";

const flavorLabels = {
    chocolate: { en: "Chocolate", ar: "شوكولاتة" },
    vanilla: { en: "Vanilla", ar: "فانيليا" },
    "red-velvet": { en: "Red Velvet", ar: "ريد فلفت" },
    strawberry: { en: "Strawberry", ar: "فراولة" },
    carrot: { en: "Carrot", ar: "جزر" },
    butterscotch: { en: "Butterscotch", ar: "باترسكوتش" },
    "black-forest": { en: "Black Forest", ar: "بلاك فورست" },
    lemon: { en: "Lemon", ar: "ليمون" },
    mango: { en: "Mango", ar: "مانجو" },
    pistachio: { en: "Pistachio", ar: "فستق" },
};

const sizeLabels = {
    small: { en: "Small", ar: "صغير" },
    medium: { en: "Medium", ar: "متوسط" },
};

const formatPrice = (price) => `${Number(price).toFixed(3)} KWD`;

const ProductDetails = () => {
    const { language } = useLanguage();
    const { slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("reviews");
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const isArabic = language === "ar";

    const {
        data: cakeResponse,
        isLoading,
        isError,
    } = useGet({
        url: `/cakes/${slug}`,
        queryKey: ["cake", slug],
        enabled: Boolean(slug),
    });

    const { addToCart, isPending: isAddingToCart } = useAddToCart();

    const {
        data: myReviewResponse,
        isLoading: isMyReviewLoading,
    } = useGetMyCakeReview({
        slug,
        enabled: Boolean(slug) && isAuthenticated,
    });

    const myReview = myReviewResponse?.data || null;
    const hasReviewed = Boolean(myReview);
    const isReviewStateLoading = isAuthLoading || isMyReviewLoading;
    const canReview = !hasReviewed && !isReviewStateLoading;

    const product = cakeResponse?.data;

    if (isLoading) {
        return (
            <main className="min-h-screen bg-cream pb-16 text-ink md:pb-0">
                <div className="wrapper flex min-h-[55vh] flex-col items-center justify-center gap-4">
                    <Loader2 className="size-7 animate-spin text-primary" />

                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/50">
                        {isArabic
                            ? "جاري تحميل الكعكة..."
                            : "Loading cake..."}
                    </p>
                </div>
            </main>
        );
    }

    if (isError || !product) {
        return (
            <main className="min-h-screen bg-cream pb-16 text-ink md:pb-0">
                <div className="wrapper flex min-h-[55vh] items-center justify-center">
                    <div className="w-full max-w-md border border-ink/10 bg-white/60 px-6 py-12 text-center">
                        <h1 className="font-display text-2xl font-semibold text-primary">
                            {isArabic
                                ? "لم يتم العثور على الكعكة"
                                : "Cake not found"}
                        </h1>

                        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-ink/60">
                            {isArabic
                                ? "تعذر العثور على هذه الكعكة. تصفح مجموعتنا لاكتشاف المزيد."
                                : "We couldn't find this cake. Explore our collection to discover more."}
                        </p>

                        <Button
                            asChild
                            variant="asymmetric"
                            className="mt-6"
                        >
                            <Link to="/cakes">
                                {isArabic ? "استكشف الكعكات" : "Explore cakes"}
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    const productName =
        product.name?.[language] || product.name?.en || "";

    const categoryName =
        product.category?.name?.[language] ||
        product.category?.name?.en ||
        "";

    const description =
        product.description?.[language] ||
        product.description?.en ||
        "";

    const flavor =
        normalizeFlavors(product.flavor)
            .map((item) => flavorLabels[item]?.[language] ?? item)
            .join(", ") || "-";

    const size =
        sizeLabels[product.weightSize]?.[language] ?? product.weightSize;

    const originalPrice = Number(product.price);

    const discountedPrice =
        product.discountPercentage > 0
            ? originalPrice -
              (originalPrice * product.discountPercentage) / 100
            : originalPrice;

    const isOutOfStock = Number(product.stock) <= 0;

    const heroImage =
        product.category?.imageUrl || product.images?.[0]?.url || "";

    const increaseQuantity = () => {
        setQuantity((current) =>
            Math.min(current + 1, Number(product.stock)),
        );
    };

    const decreaseQuantity = () => {
        setQuantity((current) => Math.max(current - 1, 1));
    };

    const handleAddToCart = () => {
        if (isOutOfStock || isAddingToCart) {
            return;
        }

        addToCart(product._id, quantity);
    };

    const handleWriteReview = () => {
        if (hasReviewed) {
            toast.error(
                isArabic
                    ? "لقد قيّمت هذه الكعكة بالفعل. يمكنك كتابة مراجعة واحدة فقط لكل كعكة."
                    : "You have already reviewed this cake. You can leave only one review per cake.",
            );

            return;
        }

        if (!isAuthenticated) {
            toast.error(
                isArabic
                    ? "يرجى تسجيل الدخول لكتابة مراجعة"
                    : "Please log in to write a review",
            );

            navigate("/auth/login", {
                replace: true,
                state: { from: location },
            });

            return;
        }

        setIsReviewModalOpen(true);
    };

    return (
        <main className="min-h-screen overflow-hidden bg-cream pb-16 text-ink md:pb-0">
            {/* Hero and breadcrumb */}
            <section className="relative isolate overflow-hidden bg-ink text-cream">
                {heroImage && (
                    <img
                        src={heroImage}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 -z-20 size-full scale-105 object-cover"
                    />
                )}

                <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(59,32,38,0.70)_0%,rgba(59,32,38,0.94)_100%)]" />

                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.09),transparent_45%)]" />

                <div className="wrapper py-7 md:py-10">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-6 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-cream/60"
                    >
                        <Link
                            to="/"
                            className="shrink-0 transition-colors hover:text-cream"
                        >
                            {isArabic ? "الرئيسية" : "Home"}
                        </Link>

                        <ChevronRight className="size-3 shrink-0 rtl:rotate-180" />

                        <Link
                            to="/cakes"
                            className="shrink-0 transition-colors hover:text-cream"
                        >
                            {isArabic ? "الكعكات" : "Cakes"}
                        </Link>

                        {product.category?.slug && (
                            <>
                                <ChevronRight className="size-3 shrink-0 rtl:rotate-180" />

                                <Link
                                    to={`/category/${product.category.slug}`}
                                    className="max-w-32 truncate transition-colors hover:text-cream sm:max-w-48"
                                >
                                    {categoryName}
                                </Link>
                            </>
                        )}

                        <ChevronRight className="size-3 shrink-0 rtl:rotate-180" />

                        <span
                            aria-current="page"
                            className="min-w-0 truncate text-cream"
                        >
                            {productName}
                        </span>
                    </nav>

                    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-3xl">
                            <h1 className="break-words font-display text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-cream sm:text-4xl md:text-5xl">
                                {productName}
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 border-t border-cream/20 pt-4 md:shrink-0 md:border-s md:border-t-0 md:ps-5 md:pt-0">
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <Star className="size-4 fill-cream text-cream" />

                                    <span className="text-base font-bold text-cream">
                                        {Number(
                                            product.avgRating || 0,
                                        ).toFixed(1)}
                                    </span>
                                </div>

                                <p className="mt-1 text-[10px] text-cream/55">
                                    {product.numReviews || 0}{" "}
                                    {isArabic ? "مراجعة" : "reviews"}
                                </p>
                            </div>

                            <span className="h-8 w-px bg-cream/20" />

                            <div>
                                <span
                                    className={`inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest ${
                                        product.stock > 0
                                            ? "text-cream"
                                            : "text-cream/60"
                                    }`}
                                >
                                    <span
                                        className={`size-1.5 rounded-full ${
                                            product.stock > 0
                                                ? "bg-emerald-400"
                                                : "bg-cream/50"
                                        }`}
                                    />

                                    {product.stock > 0
                                        ? isArabic
                                            ? "متوفر"
                                            : "In stock"
                                        : isArabic
                                          ? "غير متوفر"
                                          : "Out of stock"}
                                </span>

                                {product.stock > 0 && (
                                    <p className="mt-1 text-[10px] text-cream/55">
                                        {product.stock}{" "}
                                        {isArabic ? "متوفر" : "available"}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product gallery and details */}
            <section className="relative overflow-hidden py-8 md:py-12 xl:py-14">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-e-32 top-24 size-96 rounded-full bg-blush/45 blur-3xl"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-s-32 bottom-10 size-80 rounded-full bg-blush/35 blur-3xl"
                />

                <div className="wrapper relative">
                    <div className="grid items-start gap-8 md:gap-10 xl:grid-cols-[0.85fr_1.15fr] xl:gap-12">
                        {/* Smaller product image */}
                        <div className="mx-auto w-full max-w-[560px] min-w-0 xl:max-w-none">
                            <ProductGallery product={product} />
                        </div>

                        {/* Product information */}
                        <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-primary">
                                {isArabic ? "تفاصيل المنتج" : "Product details"}
                            </span>

                            <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-2 border-b border-ink/10 pb-5">
                                <span
                                    dir="ltr"
                                    className="font-display text-3xl font-semibold leading-none tracking-tight text-primary sm:text-4xl"
                                >
                                    {formatPrice(discountedPrice)}
                                </span>

                                {product.discountPercentage > 0 && (
                                    <>
                                        <span
                                            dir="ltr"
                                            className="pb-0.5 text-sm text-ink/40 line-through"
                                        >
                                            {formatPrice(originalPrice)}
                                        </span>

                                        <span className="inline-flex items-center gap-1.5 bg-primary px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-cream">
                                            <Flame className="size-3" />
                                            {product.discountPercentage}%{" "}
                                            {isArabic ? "خصم" : "OFF"}
                                        </span>
                                    </>
                                )}
                            </div>

                            <p className="mt-5 text-sm leading-7 text-ink/65">
                                {description}
                            </p>

                            {product.tags?.length > 0 && (
                                <div className="mt-5 flex flex-wrap items-center gap-2">
                                    <Tag className="me-1 size-3.5 text-primary" />

                                    {product.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="border border-ink/10 bg-white/60 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-ink/60"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Product attributes moved above quantity and cart */}
                            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                                <ProductAttribute
                                    icon={PackageCheck}
                                    label={isArabic ? "الحجم" : "Size"}
                                    value={size}
                                />

                                <ProductAttribute
                                    icon={Users}
                                    label={isArabic ? "الحصص" : "Servings"}
                                    value={product.servings ?? "-"}
                                    dir="ltr"
                                />

                                <ProductAttribute
                                    icon={Clock3}
                                    label={isArabic ? "النكهة" : "Flavor"}
                                    value={flavor}
                                />
                            </div>

                            {/* Quantity and cart */}
                            <div className="mt-7 border-t border-ink/10 pt-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink">
                                            {isArabic ? "الكمية" : "Quantity"}
                                        </p>

                                        <p className="mt-1.5 text-xs text-ink/45">
                                            {isOutOfStock
                                                ? isArabic
                                                    ? "غير متوفر حاليًا"
                                                    : "Currently unavailable"
                                                : isArabic
                                                  ? "اختر الكمية المطلوبة"
                                                  : "Select your quantity"}
                                        </p>
                                    </div>

                                    <div className="flex h-11 items-center border border-ink/15 bg-white/60">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            disabled={
                                                quantity <= 1 ||
                                                isOutOfStock ||
                                                isAddingToCart
                                            }
                                            onClick={decreaseQuantity}
                                            className="size-10 rounded-none text-ink hover:bg-blush hover:text-primary"
                                        >
                                            <Minus className="size-3.5" />
                                        </Button>

                                        <span
                                            dir="ltr"
                                            className="w-9 text-center text-sm font-bold text-ink"
                                        >
                                            {quantity}
                                        </span>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            disabled={
                                                quantity >= product.stock ||
                                                isOutOfStock ||
                                                isAddingToCart
                                            }
                                            onClick={increaseQuantity}
                                            className="size-10 rounded-none text-ink hover:bg-blush hover:text-primary"
                                        >
                                            <Plus className="size-3.5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Add to cart: default Button variant */}
                                <Button
                                    type="button"
                                    size="lg"
                                    disabled={isOutOfStock || isAddingToCart}
                                    onClick={handleAddToCart}
                                    className="mt-5 h-12 w-full gap-3 text-[10px] font-bold uppercase tracking-[0.14em]"
                                >
                                    {isAddingToCart ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />

                                            {isArabic
                                                ? "جاري الإضافة..."
                                                : "Adding to cart..."}
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="size-4" />

                                            {isOutOfStock
                                                ? isArabic
                                                    ? "غير متوفر"
                                                    : "Out of stock"
                                                : isArabic
                                                  ? "أضف إلى السلة"
                                                  : "Add to cart"}
                                        </>
                                    )}
                                </Button>

                                <p className="mt-3 text-center text-[10px] leading-5 text-ink/45">
                                    {isArabic
                                        ? "كعكات مميزة للحظاتك الخاصة."
                                        : "Something special for your sweetest moments."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ProductAddOns />

            {/* Description and reviews */}
            <section className="border-t border-ink/10 bg-white/30 py-10 md:py-14">
                <div className="wrapper">
                    <div className="flex gap-7 border-b border-ink/10 sm:gap-10">
                        <button
                            type="button"
                            onClick={() => setActiveTab("description")}
                            className={`relative cursor-pointer pb-4 text-[10px] font-bold uppercase tracking-[0.13em] transition-colors sm:text-xs ${
                                activeTab === "description"
                                    ? "text-primary"
                                    : "text-ink/45 hover:text-ink"
                            }`}
                        >
                            {isArabic ? "الوصف" : "Description"}

                            {activeTab === "description" && (
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("reviews")}
                            className={`relative cursor-pointer pb-4 text-[10px] font-bold uppercase tracking-[0.13em] transition-colors sm:text-xs ${
                                activeTab === "reviews"
                                    ? "text-primary"
                                    : "text-ink/45 hover:text-ink"
                            }`}
                        >
                            {isArabic
                                ? `المراجعات (${product.numReviews || 0})`
                                : `Reviews (${product.numReviews || 0})`}

                            {activeTab === "reviews" && (
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
                            )}
                        </button>
                    </div>

                    <div className="pt-8">
                        {activeTab === "description" ? (
                            <div className="max-w-3xl">
                                <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-primary">
                                    {isArabic
                                        ? "تفاصيل المنتج"
                                        : "Made for your moments"}
                                </span>

                                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                                    {isArabic
                                        ? `عن ${productName}`
                                        : `About ${productName}`}
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-ink/65 md:text-base">
                                    {description}
                                </p>

                                <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink/10 pt-6 md:grid-cols-3">
                                    <Detail
                                        label={isArabic ? "الفئة" : "Category"}
                                        value={categoryName || "-"}
                                    />

                                    <Detail
                                        label={isArabic ? "النكهة" : "Flavor"}
                                        value={flavor}
                                    />

                                    <Detail
                                        label={isArabic ? "الحجم" : "Size"}
                                        value={size || "-"}
                                    />

                                    <Detail
                                        label={isArabic ? "الحصص" : "Servings"}
                                        value={product.servings ?? "-"}
                                    />

                                    <Detail
                                        label={isArabic ? "التقييم" : "Rating"}
                                        value={`${Number(
                                            product.avgRating || 0,
                                        ).toFixed(1)} / 5`}
                                    />

                                    <Detail
                                        label={
                                            isArabic ? "المراجعات" : "Reviews"
                                        }
                                        value={product.numReviews || 0}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-5xl">
                                <ProductReviews
                                    slug={slug}
                                    canReview={canReview}
                                    hasReviewed={hasReviewed}
                                    onWriteReview={handleWriteReview}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <ReviewFormModal
                open={isReviewModalOpen}
                onOpenChange={setIsReviewModalOpen}
                slug={slug}
                cakeName={productName}
            />
        </main>
    );
};

const ProductAttribute = ({ icon: Icon, label, value, dir }) => {
    return (
        <div className="min-w-0 border border-ink/10 bg-white/50 p-3 sm:p-4">
            <div className="flex items-center gap-1.5 text-primary sm:gap-2">
                <Icon className="size-3.5 shrink-0 sm:size-4" />

                <span className="truncate text-[9px] font-bold uppercase tracking-[0.08em] sm:text-[10px] sm:tracking-wider">
                    {label}
                </span>
            </div>

            <p
                dir={dir}
                className="mt-2 truncate text-xs font-semibold text-ink sm:text-sm"
            >
                {value}
            </p>
        </div>
    );
};

const Detail = ({ label, value }) => {
    return (
        <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/45">
                {label}
            </p>

            <p className="mt-1.5 break-words text-sm font-semibold text-ink">
                {value}
            </p>
        </div>
    );
};

export default ProductDetails;