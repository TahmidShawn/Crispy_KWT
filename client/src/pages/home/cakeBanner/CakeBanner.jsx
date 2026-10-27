import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
const u = (id, w = 1400) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

const slides = [
    {
        eyebrow: "The summer cake edit",
        title: "Made to be the center of attention.",
        copy: "Sculptural cakes, delicate flavors, and the loveliest finishing touch for every celebration.",
        image: u("photo-1604413191066-4dd20bedf486"),
    },
    {
        eyebrow: "Fresh berries, soft cream",
        title: "A little joy in every layer.",
        copy: "Meet our seasonal collection, baked in small batches with ripe berries and real vanilla.",
        image: u("photo-1677840147140-252adb9ca347"),
    },
    {
        eyebrow: "Celebrate beautifully",
        title: "Cakes worth gathering around.",
        copy: "From quiet milestones to big celebrations, every cake is thoughtfully made just for you.",
        image: u("photo-1694043325785-d841a964257f"),
    },
    {
        eyebrow: "Delicate and French",
        title: "Macarons that melt in your mouth.",
        copy: "Rose, pistachio, and vanilla bean, baked fresh every morning and boxed with love.",
        image: u("photo-1562440499-64c9a111f713"),
    },
    {
        eyebrow: "In full bloom",
        title: "Edible flowers, unforgettable flavor.",
        copy: "Hand-finished floral designs that look beautiful and taste even better.",
        image: u("photo-1557308536-ee471ef2c390"),
    },
    {
        eyebrow: "For the chocolate lover",
        title: "Rich, dark, and totally irresistible.",
        copy: "Deep cocoa layers with silky ganache, made for anyone who believes in dessert first.",
        image: u("photo-1578985545062-69928b1d9587"),
    },
    {
        eyebrow: "Little treats, big smiles",
        title: "Cupcakes for every sweet moment.",
        copy: "Mix and match your favorite flavors and make someone’s day, yours included.",
        image: u("photo-1558636508-e0db3814bd1d"),
    },
];

const CakeBanner = () => {
    const [active, setActive] = useState(0);
    const slideRefs = useRef([]);
    const copyRef = useRef(null);

    const goTo = (i) => setActive((i + slides.length) % slides.length);

    // Autoplay (manual click করলে timer reset হয়)
    useEffect(() => {
        const timer = setTimeout(() => goTo(active + 1), 6000);
        return () => clearTimeout(timer);
    }, [active]);

    // Slide change animation
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
    }, [active]);

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
                {slides.map((s, i) => (
                    <div
                        key={s.title}
                        ref={(el) => (slideRefs.current[i] = el)}
                        aria-hidden={i !== active}
                        className="absolute inset-0"
                        style={{ opacity: i === 0 ? 1 : 0 }}
                    >
                        <img
                            src={s.image}
                            alt=""
                            className="h-full w-full object-cover object-[center_52%]"
                        />
                    </div>
                ))}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 z-2 bg-[linear-gradient(90deg,rgba(30,20,18,.78),rgba(30,20,18,.25)),linear-gradient(0deg,rgba(27,18,16,.55),transparent_52%)] md:bg-[linear-gradient(90deg,rgba(30,20,18,.84)_0%,rgba(30,20,18,.58)_38%,rgba(30,20,18,.13)_72%,rgba(30,20,18,.08)_100%),linear-gradient(0deg,rgba(27,18,16,.42),transparent_42%)]" />

            {/* Content */}
            <div className="wrapper relative z-3 flex h-full flex-col justify-center pb-10">
                <div ref={copyRef} className="max-w-160">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.17em] text-blush">
                        {slide.eyebrow}
                    </span>
                    <h1 className="mb-5 mt-4 font-display text-[40px] font-medium leading-none tracking-[-0.045em] text-white md:text-[clamp(44px,5vw,72px)]">
                        {slide.title}
                    </h1>
                    <p className="max-w-[94%] text-[13px] leading-[1.75] text-white/80 md:max-w-120 md:text-[15px]">
                        {slide.copy}
                    </p>
                    <div className="mt-7 flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-7">
                        <Link
                            to="deals"
                            className="inline-flex items-center gap-3.5 bg-primary px-6 py-3.5 text-[11px] font-semibold tracking-[0.04em] text-blush transition  hover:bg-blush hover:text-ink"
                        >
                            Explore the collection
                            <ArrowRight className="size-4 shrink-0" />
                        </Link>
                        <Link
                            to="deals"
                            className="inline-flex items-center gap-3.5 border border-blush px-6 py-3.5 text-[11px] font-semibold tracking-[0.04em] text-cream transition hover:transition-all hover:bg-blush hover:text-ink"
                        >
                            Shop by occasion
                            <ArrowRight className="size-4 shrink-0" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer controls */}
            <div className="absolute inset-x-0 bottom-5 z-4">
                <div className="wrapper flex items-center justify-between">
                    <span className="flex items-center gap-3 text-[9px] tracking-[0.15em]">
                        0{active + 1}
                        <i className="h-px w-12 bg-white/55" />0{slides.length}
                    </span>

                    <div
                        className="hidden gap-2 md:flex"
                        aria-label="Choose slide"
                    >
                        {slides.map((s, i) => (
                            <button
                                key={s.title}
                                type="button"
                                onClick={() => goTo(i)}
                                aria-label={`Show slide ${i + 1}: ${s.title}`}
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
                            aria-label="Previous slide"
                            className="size-9 rounded-none border-white/45 bg-white/5 p-0 text-white hover:bg-cream hover:text-primary"
                        >
                            <ChevronLeft className="size-5" />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => goTo(active + 1)}
                            aria-label="Next slide"
                            className="size-9 rounded-none border-white/45 bg-white/5 p-0 text-white hover:bg-cream hover:text-primary"
                        >
                            <ChevronRight className="size-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CakeBanner;
