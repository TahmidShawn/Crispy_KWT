import {
    CheckCircle2,
    Loader2,
    MessageSquare,
    Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useGetCakeReviews } from "@/hooks/useReviews";

const formatDate = (value, isArabic) => {
    if (!value) {
        return "";
    }

    try {
        return new Intl.DateTimeFormat(isArabic ? "ar-KW" : "en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(new Date(value));
    } catch {
        return "";
    }
};

const StarRow = ({ rating, size = "size-4" }) => {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
                <Star
                    key={index}
                    className={
                        index < rating
                            ? `${size} fill-primary text-primary`
                            : `${size} text-ink/20`
                    }
                />
            ))}
        </div>
    );
};

const ProductReviews = ({
    slug,
    onWriteReview,
    canReview = true,
    hasReviewed = false,
}) => {
    const { language } = useLanguage();
    const isArabic = language === "ar";

    const { data, isLoading, isError, refetch } = useGetCakeReviews({
        slug,
    });

    const reviews = data?.data || [];
    const summary = data?.summary;
    const avgRating = Number(summary?.avgRating || 0);
    const numReviews = summary?.numReviews || 0;

    if (isLoading) {
        return (
            <div className="mt-8 flex min-h-52 flex-col items-center justify-center gap-3 rounded-[14px] border border-ink/10 bg-white/60 p-10 text-sm text-ink/55">
                <Loader2 className="size-6 animate-spin text-primary" />

                {isArabic
                    ? "جاري تحميل المراجعات..."
                    : "Loading reviews..."}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mt-8 rounded-[14px] border border-ink/10 bg-white/60 px-6 py-12 text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-tl-xl rounded-br-xl bg-blush text-primary">
                    <MessageSquare className="size-5" />
                </div>

                <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                    {isArabic
                        ? "تعذر تحميل المراجعات"
                        : "Reviews unavailable"}
                </h3>

                <p className="mt-2 text-sm text-ink/55">
                    {isArabic
                        ? "حدث خطأ أثناء تحميل المراجعات."
                        : "We couldn't load the reviews. Please try again."}
                </p>

                <Button
                    type="button"
                    variant="outline-asymmetric"
                    size="sm"
                    className="mt-5"
                    onClick={() => refetch()}
                >
                    {isArabic ? "إعادة المحاولة" : "Try again"}
                </Button>
            </div>
        );
    }

    return (
        <div className="mt-8 space-y-5">
            {/* Summary */}
            <section className="overflow-hidden rounded-[14px] border border-ink/10 bg-white/60">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 px-5 py-5 sm:px-6">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-primary">
                            {isArabic ? "آراء العملاء" : "Customer feedback"}
                        </span>

                        <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                            {isArabic ? "تقييمات العملاء" : "Customer reviews"}
                        </h3>

                        <p className="mt-1 text-xs text-ink/50">
                            {isArabic
                                ? "اكتشف تجارب العملاء مع هذه الكعكة."
                                : "See what customers think about this cake."}
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="outline-asymmetric"
                        size="sm"
                        onClick={onWriteReview}
                        disabled={!canReview}
                        className="shrink-0 text-xs"
                    >
                        {hasReviewed
                            ? isArabic
                                ? "تم التقييم"
                                : "Reviewed"
                            : isArabic
                              ? "اكتب مراجعة"
                              : "Write a review"}
                    </Button>
                </div>

                {numReviews > 0 ? (
                    <div className="grid gap-7 p-5 sm:p-6 md:grid-cols-[180px_1fr] md:items-center md:gap-10">
                        <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
                            <div>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="font-display text-5xl font-semibold leading-none tracking-tight text-primary">
                                        {avgRating.toFixed(1)}
                                    </span>

                                    <span className="text-xs font-medium text-ink/40">
                                        / 5
                                    </span>
                                </div>

                                <StarRow
                                    rating={Math.round(avgRating)}
                                    size="size-4"
                                />
                            </div>

                            <p className="text-xs leading-5 text-ink/55">
                                {isArabic
                                    ? `بناءً على ${numReviews} مراجعة`
                                    : `Based on ${numReviews} ${
                                          numReviews === 1
                                              ? "review"
                                              : "reviews"
                                      }`}
                            </p>
                        </div>

                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count =
                                    summary?.distribution?.[star] || 0;

                                const percent = numReviews
                                    ? Math.round((count / numReviews) * 100)
                                    : 0;

                                return (
                                    <div
                                        key={star}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="flex w-8 shrink-0 items-center justify-end gap-1 text-xs font-semibold text-ink/60">
                                            {star}

                                            <Star className="size-3 fill-primary text-primary" />
                                        </span>

                                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/[0.07]">
                                            <div
                                                className="h-full rounded-full bg-primary transition-[width] duration-500"
                                                style={{
                                                    width: `${percent}%`,
                                                }}
                                            />
                                        </div>

                                        <span className="w-14 shrink-0 text-end text-[10px] tabular-nums text-ink/45">
                                            {count} ({percent}%)
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="px-5 py-8 text-center sm:px-6">
                        <div className="mx-auto grid size-12 place-items-center rounded-tl-xl rounded-br-xl bg-blush text-primary">
                            <Star className="size-5" />
                        </div>

                        <p className="mt-4 font-display text-lg font-semibold text-ink">
                            {isArabic
                                ? "كن أول من يقيّم هذه الكعكة"
                                : "Be the first to rate this cake"}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-ink/50">
                            {isArabic
                                ? "لا توجد مراجعات حتى الآن."
                                : "There are no reviews yet."}
                        </p>
                    </div>
                )}
            </section>

            {/* Individual reviews */}
            {reviews.length === 0 ? (
                <div className="rounded-[14px] border border-ink/10 bg-white/40 px-6 py-10 text-center">
                    <div className="mx-auto grid size-12 place-items-center rounded-tl-xl rounded-br-xl bg-blush text-primary">
                        <MessageSquare className="size-5" />
                    </div>

                    <p className="mt-4 font-display text-lg font-semibold text-ink">
                        {isArabic
                            ? "لا توجد مراجعات بعد"
                            : "Nothing here just yet"}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-ink/50">
                        {isArabic
                            ? "شارك تجربتك وساعد الآخرين في اختيار كعكتهم."
                            : "Share your experience and help others choose their cake."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {reviews.map((review) => (
                        <article
                            key={review._id}
                            className="flex min-w-0 flex-col rounded-[14px] border border-ink/10 bg-white/60 p-4 transition-colors duration-200 hover:border-primary/25 sm:p-5"
                        >
                            <div className="flex min-w-0 items-start gap-3">
                                {review.user?.avatarUrl ? (
                                    <img
                                        src={review.user.avatarUrl}
                                        alt={review.user.username}
                                        className="size-10 shrink-0 rounded-full border border-ink/10 object-cover"
                                    />
                                ) : (
                                    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-blush font-display text-sm font-semibold text-primary">
                                        {(
                                            review.user?.username?.[0] || "?"
                                        ).toUpperCase()}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className="break-words text-sm font-semibold text-ink"
                                                title={review.user?.username}
                                            >
                                                {review.user?.username ||
                                                    (isArabic
                                                        ? "عميل"
                                                        : "Customer")}
                                            </p>

                                            <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                                                <CheckCircle2 className="size-3 shrink-0" />

                                                {review.isVerifiedPurchase
                                                    ? isArabic
                                                        ? "شراء موثّق"
                                                        : "Verified purchase"
                                                    : isArabic
                                                      ? "عميل موثّق"
                                                      : "Verified customer"}
                                            </span>
                                        </div>

                                        <span className="shrink-0 text-[10px] text-ink/45">
                                            {formatDate(
                                                review.createdAt,
                                                isArabic,
                                            )}
                                        </span>
                                    </div>

                                    <div className="mt-2">
                                        <StarRow
                                            rating={Number(review.rating)}
                                            size="size-3.5"
                                        />
                                    </div>
                                </div>
                            </div>

                            {review.comment && (
                                <p className="mt-4 line-clamp-4 text-sm leading-6 text-ink/65">
                                    {review.comment}
                                </p>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductReviews;