import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useLanguage } from "@/context/LanguageContext"; // তোমার path অনুযায়ী ঠিক করে নাও
import { bannerImages } from "@/data/data";

const CakeBanner = () => {
    const { t, language } = useLanguage();
    const b = t.banner;
    const slides = b.slides;

    const [active, setActive] = useState(0);
    const slideRefs = useRef([]);
    const copyRef = useRef(null);

    const goTo = (i) => setActive((i + slides.length) % slides.length);

    // Autoplay (manual click করলে timer reset হয়)
    useEffect(() => {
        const timer = setTimeout(() => goTo(active + 1), 6000);
        return () => clearTimeout(timer);
    }, [active]);

    // Slide change animation (শুধু active বদলালে)
    useLayoutEffect(() => {
        slideRefs.current.forEach((el, i) => {
            if (!el) return;
            const isActive = i === active;

            gsap.set(el, { zIndex: isActive ? 1 : 0 });
            gsap.to(el, {
                opacity: isActive ? 1 : 0,
                duration: 1,
                ease: "power2.inOut",
                overwrite: "auto",
            });

            if (isActive) {
                gsap.fromTo(
                    el.querySelector("img"),
                    { scale: 1.06 },
                    {
                        scale: 1,
                        duration: 7,
                        ease: "power1.out",
                        overwrite: true,
                    },
                );
            }
        });
    }, [active]);

    // Text animation (slide বা ভাষা বদলালে)
    useLayoutEffect(() => {
        gsap.fromTo(
            copyRef.current.children,
            { opacity: 0, y: 16 },
            {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: "power3.out",
                overwrite: true,
            },
        );
    }, [active, language]);

    // Unmount cleanup
    useEffect(() => {
        const els = slideRefs.current;
        return () => gsap.killTweensOf(els);
    }, []);

    const slide = slides[active];

    return (
        <section
            id="home"
            aria-roledescription="carousel"
            className="relative h-135 w-full overflow-hidden bg-ink text-white md:h-[min(620px,calc(100vh-68px))] md:min-h-125"
        >
            {/* Slides */}
            <div className="absolute inset-0">
                {bannerImages.map((src, i) => (
                    <div
                        key={src}
                        ref={(el) => (slideRefs.current[i] = el)}
                        aria-hidden={i !== active}
                        className="absolute inset-0"
                        style={{ opacity: i === 0 ? 1 : 0 }}
                    >
                        <img
                            src={src}
                            alt=""
                            className="h-full w-full object-cover object-[center_52%]"
                        />
                    </div>
                ))}
            </div>

            {/* Overlay (RTL এ gradient উল্টে যায়, যাতে লেখার দিকে অন্ধকার থাকে) */}
            <div className="absolute inset-0 z-2 rtl:-scale-x-100 bg-[linear-gradient(90deg,rgba(30,20,18,.78),rgba(30,20,18,.25)),linear-gradient(0deg,rgba(27,18,16,.55),transparent_52%)] md:bg-[linear-gradient(90deg,rgba(30,20,18,.84)_0%,rgba(30,20,18,.58)_38%,rgba(30,20,18,.13)_72%,rgba(30,20,18,.08)_100%),linear-gradient(0deg,rgba(27,18,16,.42),transparent_42%)]" />

            {/* Content */}
            <div className="wrapper relative z-3 flex h-full flex-col justify-center pb-10">
                <div ref={copyRef} className="max-w-160">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.17em] text-blush rtl:text-xs rtl:tracking-normal">
                        {slide.eyebrow}
                    </span>
                    <h1 className="mb-5 mt-4 font-serif text-[40px] font-medium leading-none tracking-[-0.045em] text-white md:text-[clamp(44px,5vw,72px)] rtl:leading-tight rtl:tracking-normal">
                        {slide.title}
                    </h1>
                    <p className="max-w-[94%] text-[13px] leading-[1.75] text-white/80 md:max-w-120 md:text-[15px]">
                        {slide.copy}
                    </p>
                    <div className="mt-7 flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-7">
                        <Link
                            to="deals"
                            className="inline-flex items-center gap-3.5 bg-primary px-6 py-3.5 text-[11px] font-semibold tracking-[0.04em] text-blush transition hover:bg-blush hover:text-ink rtl:tracking-normal"
                        >
                            {b.primaryCta}
                            <ArrowRight className="size-4 shrink-0 rtl:rotate-180" />
                        </Link>
                        <Link
                            to="deals"
                            className="inline-flex items-center gap-3.5 border border-blush px-6 py-3.5 text-[11px] font-semibold tracking-[0.04em] text-cream transition hover:bg-blush hover:text-ink rtl:tracking-normal"
                        >
                            {b.secondaryCta}
                            <ArrowRight className="size-4 shrink-0 rtl:rotate-180" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer controls */}
            <div className="absolute inset-x-0 bottom-5 z-4">
                <div className="wrapper flex items-center justify-between">
                    <span
                        dir="ltr"
                        className="flex items-center gap-3 text-[9px] tracking-[0.15em]"
                    >
                        0{active + 1}
                        <i className="h-px w-12 bg-white/55" />0{slides.length}
                    </span>

                    <div
                        className="hidden gap-2 md:flex"
                        aria-label={b.chooseSlide}
                    >
                        {slides.map((s, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => goTo(i)}
                                aria-label={`${b.showSlide} ${i + 1}: ${s.title}`}
                                className={`size-1.75 cursor-pointer rounded-full border border-white transition ${
                                    i === active
                                        ? "scale-[1.35] bg-white"
                                        : "bg-transparent"
                                }`}
                            />
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => goTo(active - 1)}
                            aria-label={b.prev}
                            className="size-9 rounded-none border-white/45 bg-white/5 p-0 text-white hover:bg-cream hover:text-primary"
                        >
                            <ChevronLeft className="size-5 rtl:rotate-180" />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => goTo(active + 1)}
                            aria-label={b.next}
                            className="size-9 rounded-none border-white/45 bg-white/5 p-0 text-white hover:bg-cream hover:text-primary"
                        >
                            <ChevronRight className="size-5 rtl:rotate-180" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CakeBanner;