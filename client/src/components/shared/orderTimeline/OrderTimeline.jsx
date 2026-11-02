import { cn } from "@/lib/utils";

const OrderTimeline = ({ steps = [], language = "en" }) => {
    const isArabic = language === "ar";

    return (
        <div className="relative">
            <div className="hidden lg:block">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 top-1/2 w-px -translate-x-1/2 translate-y-1/2 bg-border" />
                    {steps.map((step, index) => (
                        <div
                            key={step.key}
                            className={cn(
                                "absolute left-0 top-1/2 -translate-x-1/2 translate-y-1/2 flex size-2.5 items-center justify-center",
                                step.completed
                                    ? "bg-primary text-primary-foreground"
                                    : step.current
                                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-1"
                                    : "bg-background text-muted-foreground border border-border",
                            )}
                        >
                            <step.icon className="size-4" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-8 lg:space-y-0 lg:flex lg:flex-col lg:items-start lg:gap-6">
                {steps.map((step, index) => (
                    <div
                        key={step.key}
                        className={cn(
                            "relative flex flex-col lg:flex-row lg:items-center lg:gap-4",
                            step.current && "lg:pt-1",
                        )}
                    >
                        <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-background p-1 text-center lg:text-left">
                            <div className={cn("flex size-6 shrink-0 items-center justify-center rounded-full", step.completed ? "bg-primary" : "bg-muted")}>
                                <step.icon className={cn("size-3.5 shrink-0", step.completed ? "text-primary-foreground" : "text-muted-foreground")} />
                            </div>
                        </div>

                        <div className="mt-2 flex flex-col lg:mt-0 lg:flex-row lg:items-center lg:gap-3 lg:w-full">
                            <div className="flex flex-col lg:w-full">
                                <p className={cn("text-sm font-semibold text-foreground", step.current && "text-primary")}>
                                    {step.title}
                                </p>
                                <p className="mt-0.5 text-sm text-muted-foreground">{step.description}</p>
                            </div>

                            {step.date && (
                                <div className="mt-2 flex items-end gap-1 lg:mt-0 lg:ml-auto lg:text-right">
                                    <p className="text-xs text-muted-foreground">{step.date}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderTimeline;
