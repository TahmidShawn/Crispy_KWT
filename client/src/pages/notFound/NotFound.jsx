import { useLocation, useNavigate } from "react-router";
import { ArrowLeft, CakeSlice, Home, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import getRoleHome from "@/utils/roleHome";

const NotFound = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const homePath = getRoleHome(user?.role);
    const missingPath = location.pathname;

    return (
        <main className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-background px-4 py-16">
            {/* Decorative background blobs */}
            <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 -bottom-24 size-72 rounded-full bg-primary/10 blur-3xl" />

            <section className="relative w-full max-w-xl text-center">
                <div className="flex items-center justify-center gap-2 select-none md:gap-4">
                    <span className="text-7xl font-extrabold text-primary/20 md:text-9xl">
                        4
                    </span>
                    <div className="flex size-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg md:size-28">
                        <CakeSlice className="size-10 md:size-14" />
                    </div>
                    <span className="text-7xl font-extrabold text-primary/20 md:text-9xl">
                        4
                    </span>
                </div>

                <h1 className="mt-8 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    Oops! This slice is missing
                </h1>

                <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                    The page you are looking for doesn&apos;t exist or was
                    moved. Let&apos;s get you back to something sweet.
                </p>

                {missingPath && missingPath !== "/" && (
                    <p className="mx-auto mt-4 max-w-md truncate rounded-md border border-dashed border-border bg-muted/50 px-3 py-1.5 font-mono text-xs text-muted-foreground">
                        {missingPath}
                    </p>
                )}

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Button
                        size="lg"
                        className="inline-flex items-center justify-center gap-2 rounded-lg whitespace-nowrap"
                        onClick={() => navigate(homePath)}
                    >
                        <Home className="size-4 shrink-0" />
                        <span>Back to home</span>
                    </Button>

                    <Button
                        size="lg"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary bg-transparent whitespace-nowrap text-primary hover:bg-primary/10"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="size-4 shrink-0" />
                        <span>Go back</span>
                    </Button>

                    <Button
                        size="lg"
                        className="inline-flex items-center justify-center gap-2 rounded-lg whitespace-nowrap"
                        onClick={() => navigate("/search")}
                    >
                        <Search className="size-4 shrink-0" />
                        <span>Search cakes</span>
                    </Button>
                </div>
            </section>
        </main>
    );
};

export default NotFound;
