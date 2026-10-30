import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/LanguageContext";
import useCreateReview from "@/hooks/useCreateReview";

const reviewSchema = z.object({
    rating: z
        .number({ error: "Please pick a rating" })
        .int("Rating must be a whole number")
        .min(1, "Please pick a rating")
        .max(5, "Rating cannot exceed 5"),

    comment: z
        .string()
        .trim()
        .max(500, "Comment cannot exceed 500 characters"),
});

const MAX_COMMENT_LENGTH = 500;

const ReviewFormModal = ({ open, onOpenChange, slug, cakeName }) => {
    const { language } = useLanguage();
    const isArabic = language === "ar";

    const [hoveredRating, setHoveredRating] = useState(0);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            comment: "",
        },
    });

    const { mutate: createReview, isPending } = useCreateReview();

    const rating = watch("rating");
    const comment = watch("comment") || "";

    const handleClose = () => {
        if (isPending) {
            return;
        }

        setHoveredRating(0);
        reset({ rating: 0, comment: "" });
        onOpenChange(false);
    };

    const onSubmit = (values) => {
        createReview(
            {
                slug,
                rating: values.rating,
                comment: values.comment || "",
            },
            {
                onSuccess: () => {
                    setHoveredRating(0);
                    reset({ rating: 0, comment: "" });
                    onOpenChange(false);
                },
            },
        );
    };

    const activeRating = hoveredRating || rating;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[calc(100%-2rem)] !max-w-lg overflow-y-auto rounded-tl-2xl rounded-br-2xl border border-ink/10 bg-cream p-5 text-ink shadow-2xl sm:p-6">
                <DialogHeader className="text-start">
                    <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-primary">
                        {isArabic ? "رأيك يهمنا" : "Your feedback matters"}
                    </span>

                    <DialogTitle className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                        {isArabic ? "اكتب تقييمك" : "Write your review"}
                    </DialogTitle>

                    <DialogDescription className="text-sm leading-6 text-ink/55">
                        {isArabic
                            ? "شارك تجربتك مع هذه الكعكة. يمكنك كتابة تقييم واحد فقط لكل كعكة."
                            : "Share your experience with this cake. You can leave only one review per cake."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {cakeName && (
                        <div className="border-s-2 border-primary bg-blush/50 px-4 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                                {isArabic ? "تقييم المنتج" : "Reviewing"}
                            </p>

                            <p className="mt-1 truncate font-display text-base font-semibold text-ink">
                                {cakeName}
                            </p>
                        </div>
                    )}

                    {/* Rating */}
                    <div className="space-y-3">
                        <Label
                            id="review-rating-label"
                            className="text-xs font-bold uppercase tracking-[0.12em] text-ink"
                        >
                            {isArabic ? "التقييم" : "Your rating"}
                        </Label>

                        <div
                            className="flex flex-wrap items-center gap-1.5"
                            role="radiogroup"
                            aria-labelledby="review-rating-label"
                            onMouseLeave={() => setHoveredRating(0)}
                        >
                            {Array.from({ length: 5 }).map((_, index) => {
                                const value = index + 1;

                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        role="radio"
                                        aria-checked={rating === value}
                                        aria-label={`${value} ${isArabic ? "نجوم" : "stars"}`}
                                        className="rounded-md p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                        onMouseEnter={() =>
                                            setHoveredRating(value)
                                        }
                                        onFocus={() =>
                                            setHoveredRating(value)
                                        }
                                        onBlur={() => setHoveredRating(0)}
                                        onClick={() =>
                                            setValue("rating", value, {
                                                shouldValidate: true,
                                            })
                                        }
                                    >
                                        <Star
                                            className={`size-8 transition-colors ${
                                                activeRating >= value
                                                    ? "fill-primary text-primary"
                                                    : "text-ink/20"
                                            }`}
                                        />
                                    </button>
                                );
                            })}

                            <span className="ms-2 text-xs font-semibold text-ink/55">
                                {activeRating
                                    ? `${activeRating} / 5`
                                    : isArabic
                                      ? "اختر تقييمك"
                                      : "Select a rating"}
                            </span>
                        </div>

                        {errors.rating && (
                            <p className="text-xs text-destructive">
                                {errors.rating.message}
                            </p>
                        )}
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                            <Label
                                htmlFor="review-comment"
                                className="text-xs font-bold uppercase tracking-[0.12em] text-ink"
                            >
                                {isArabic ? "تعليقك" : "Your comment"}
                            </Label>

                            <span className="text-[10px] font-medium text-ink/40">
                                {isArabic ? "اختياري" : "Optional"}
                            </span>
                        </div>

                        <Textarea
                            id="review-comment"
                            rows={4}
                            placeholder={
                                isArabic
                                    ? "كيف كانت تجربتك مع هذه الكعكة؟"
                                    : "How was your experience with this cake?"
                            }
                            disabled={isPending}
                            aria-invalid={Boolean(errors.comment)}
                            className="min-h-28 resize-y rounded-tl-xl rounded-br-xl border-ink/15 bg-white/70 text-sm text-ink placeholder:text-ink/35 focus-visible:border-primary focus-visible:ring-primary/20"
                            {...register("comment")}
                        />

                        <div className="flex min-h-4 items-center justify-between gap-3">
                            {errors.comment ? (
                                <p className="text-xs text-destructive">
                                    {errors.comment.message}
                                </p>
                            ) : (
                                <span />
                            )}

                            <span className="shrink-0 text-[10px] tabular-nums text-ink/45">
                                {comment.length}/{MAX_COMMENT_LENGTH}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <DialogFooter className="gap-2 sm:gap-2">
                        <Button
                            type="button"
                            variant="outline-asymmetric"
                            onClick={handleClose}
                            disabled={isPending}
                            className="h-11 flex-1 text-xs font-bold uppercase tracking-[0.08em] sm:flex-none"
                        >
                            {isArabic ? "إلغاء" : "Cancel"}
                        </Button>

                        <Button
                            type="submit"
                            variant="asymmetric"
                            disabled={isPending || rating === 0}
                            className="h-11 flex-1 gap-2 text-xs font-bold uppercase tracking-[0.08em] sm:flex-none"
                        >
                            {isPending && (
                                <Loader2 className="size-4 animate-spin" />
                            )}

                            {isPending
                                ? isArabic
                                    ? "جارٍ الإرسال..."
                                    : "Submitting..."
                                : isArabic
                                  ? "نشر التقييم"
                                  : "Submit review"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewFormModal;