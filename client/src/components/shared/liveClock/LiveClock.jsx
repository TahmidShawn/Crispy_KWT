import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

const LiveClock = () => {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);

        return () => clearInterval(interval);
    }, []);

    const time = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const date = now.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="flex shrink-0 items-center gap-2.5 rounded-none rounded-tl-2xl rounded-br-2xl border border-border bg-card px-3 py-2 shadow-sm sm:gap-3 sm:px-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <Clock className="size-4" />
            </div>

            <div className="leading-tight">
                <p className="text-sm font-bold tabular-nums text-foreground">
                    {time}
                </p>

                <p className="hidden text-[11px] text-muted-foreground sm:block">
                    {date}
                </p>
            </div>
        </div>
    );
};

export default LiveClock;
