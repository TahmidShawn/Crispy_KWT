import { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    ZoomIn,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const ProductGallery = ({ product }) => {
    const [activeImage, setActiveImage] = useState(0);
    const [liked, setLiked] = useState(false);

    const images = product.images || [];

    if (images.length === 0) {
        return (
            <div className="grid aspect-square place-items-center rounded-[14px] bg-blush">
                <span className="font-display text-lg font-semibold text-primary">
                    {product.name?.en || "Cake"}
                </span>
            </div>
        );
    }

    const previousImage = () => {
        setActiveImage((current) =>
            current === 0 ? images.length - 1 : current - 1,
        );
    };

    const nextImage = () => {
        setActiveImage((current) =>
            current === images.length - 1 ? 0 : current + 1,
        );
    };

    return (
        <div className="flex min-w-0 flex-col gap-3 md:flex-row">
            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="order-2 flex gap-3 overflow-x-auto pb-1 md:order-1 md:w-[76px] md:shrink-0 md:flex-col md:overflow-visible md:pb-0">
                    {images.map((image, index) => (
                        <button
                            key={image.fileId || image.url}
                            type="button"
                            onClick={() => setActiveImage(index)}
                            aria-label={`View image ${index + 1}`}
                            aria-pressed={activeImage === index}
                            className={`size-16 shrink-0 cursor-pointer overflow-hidden rounded-[10px] border-2 bg-blush transition-all duration-200 md:size-[76px] ${
                                activeImage === index
                                    ? "border-primary opacity-100"
                                    : "border-transparent opacity-65 hover:border-primary/40 hover:opacity-100"
                            }`}
                        >
                            <img
                                src={image.url}
                                alt=""
                                loading="lazy"
                                className="size-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Main image */}
            <div className="relative order-1 min-w-0 flex-1 md:order-2">
                <div className="relative aspect-square overflow-hidden rounded-[14px] bg-blush">
                    <img
                        src={images[activeImage].url}
                        alt={product.name?.en || ""}
                        className="size-full object-cover transition-opacity duration-300"
                    />

                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/10 via-transparent to-ink/[0.03]"
                    />

                    {product.discountPercentage > 0 && (
                        <span
                            dir="ltr"
                            className="absolute inset-s-4 top-4 z-10 inline-flex items-center bg-primary px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-cream md:inset-s-5 md:top-5"
                        >
                            -{product.discountPercentage}% OFF
                        </span>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={liked ? "Remove favorite" : "Add favorite"}
                        aria-pressed={liked}
                        onClick={() => setLiked((current) => !current)}
                        className="absolute inset-e-4 top-4 z-10 size-10 rounded-full border-ink/10 bg-cream/95 text-ink shadow-none backdrop-blur-sm transition-colors hover:border-primary hover:bg-cream hover:text-primary md:inset-e-5 md:top-5"
                    >
                        <Heart
                            className={`size-[18px] transition-colors ${
                                liked
                                    ? "fill-primary text-primary"
                                    : "text-ink"
                            }`}
                        />
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Zoom image"
                        className="absolute inset-e-4 bottom-4 z-10 size-10 rounded-full border-ink/10 bg-cream/95 text-ink shadow-none backdrop-blur-sm transition-colors hover:border-primary hover:bg-cream hover:text-primary md:inset-e-5 md:bottom-5"
                    >
                        <ZoomIn className="size-[18px]" />
                    </Button>

                    {images.length > 1 && (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                aria-label="Previous image"
                                onClick={previousImage}
                                className="absolute inset-s-3 top-1/2 z-10 size-10 -translate-y-1/2 rounded-full border-ink/10 bg-cream/95 text-ink shadow-none backdrop-blur-sm transition-colors hover:border-primary hover:bg-cream hover:text-primary md:inset-s-5"
                            >
                                <ChevronLeft className="size-4 rtl:rotate-180" />
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                aria-label="Next image"
                                onClick={nextImage}
                                className="absolute inset-e-3 top-1/2 z-10 size-10 -translate-y-1/2 rounded-full border-ink/10 bg-cream/95 text-ink shadow-none backdrop-blur-sm transition-colors hover:border-primary hover:bg-cream hover:text-primary md:inset-e-5"
                            >
                                <ChevronRight className="size-4 rtl:rotate-180" />
                            </Button>

                            <div
                                dir="ltr"
                                className="absolute inset-s-4 bottom-4 z-10 bg-ink/75 px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-cream backdrop-blur-sm md:inset-s-5 md:bottom-5"
                            >
                                {String(activeImage + 1).padStart(2, "0")}
                                <span className="mx-1.5 text-cream/45">/</span>
                                {String(images.length).padStart(2, "0")}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductGallery;