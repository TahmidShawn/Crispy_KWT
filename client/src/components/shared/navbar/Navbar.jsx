import { useState } from "react";
import {
    Search,
    User,
    ShoppingBag,
    LayoutDashboard,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
import useAuth from "@/hooks/useAuth";
import usePost from "@/hooks/usePost";
import { languages } from "@/data/data";
import { Link } from "react-router";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = ({ cartCount = 0 }) => {
    const [search, setSearch] = useState("");
    const { language, setLanguage } = useLanguage();
    const { isAuthenticated, isLoading, clearUser } = useAuth();
    const { mutate: logoutUser, isPending: isLoggingOut } = usePost({
        url: "/auth/logout",
        onSuccess: () => {
            clearUser();
        },
    });

    const submitSearch = (e) => {
        e.preventDefault();
        document
            .querySelector("#deals")
            ?.scrollIntoView({ behavior: "smooth" });
    };

    const changeLanguage = (code) => {
        setLanguage(code);
    };

    const handleLogout = () => {
        logoutUser();
    };

    return (
        <header className="relative z-20 bg-cream">
            <div className="wrapper flex min-h-[60px] flex-wrap items-center justify-between gap-3 py-3 md:h-[68px] md:flex-nowrap md:py-0">
                {/* Brand */}
                <Link
                    to="/"
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    aria-label="CrispyKWT home"
                    className="font-display text-xl font-semibold tracking-[-0.04em] md:text-2xl"
                >
                    CRISPY <span className="text-pink">KWT</span>
                </Link>

                {/* Search */}
                <form
                    role="search"
                    onSubmit={submitSearch}
                    className="order-3 flex h-10 w-full items-center gap-2.5 rounded-full border border-ink/15 bg-white ps-4 pe-1 transition focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/10 md:order-none md:w-[min(470px,42vw)]"
                >
                    <Search className="size-[17px] shrink-0 text-ink/60" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search cakes, flavors, occasions..."
                        aria-label="Search cakes"
                        className="h-auto min-w-0 flex-1 border-0 bg-transparent p-0 text-[11px] text-ink shadow-none placeholder:text-ink/50 focus-visible:ring-0"
                    />
                    <Button
                        type="submit"
                        className="h-8 rounded-full bg-primary px-3.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-white hover:bg-primary/90"
                    >
                        Search
                    </Button>
                </form>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Language toggle */}
                    <div
                        role="group"
                        aria-label="Choose language"
                        dir="ltr"
                        className="inline-flex items-center rounded-full border border-ink/15 bg-white p-0.5"
                    >
                        {languages.map((l) => (
                            <button
                                key={l.code}
                                type="button"
                                onClick={() => changeLanguage(l.code)}
                                aria-pressed={language === l.code}
                                className={`cursor-pointer rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                                    language === l.code
                                        ? "bg-primary text-white"
                                        : "text-ink/70 hover:text-ink"
                                }`}
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>

                    {/* Auth state */}
                    {isLoading ? (
                        <button
                            type="button"
                            aria-label="Loading"
                            className="inline-flex size-9 cursor-wait items-center justify-center rounded-full text-ink outline-none transition hover:bg-blush focus-visible:ring-[3px] focus-visible:ring-primary/10"
                        >
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </button>
                    ) : isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    aria-label="Your account"
                                    className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-ink outline-none transition hover:bg-blush focus-visible:ring-[3px] focus-visible:ring-primary/10 max-md:hidden"
                                >
                                    <User className="size-5" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56 border-ink/10 bg-white text-ink shadow-md rounded-lg"
                            >
                                <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer gap-2 text-[13px] focus:bg-blush focus:text-ink rounded-lg px-3 py-2"
                                >
                                    <Link to="/dashboard" className="flex items-center gap-2">
                                        <LayoutDashboard className="size-4" />
                                        <span className="font-medium">Dashboard</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer gap-2 text-[13px] focus:bg-blush focus:text-ink rounded-lg px-3 py-2"
                                >
                                    <Link to="/admin/orders" className="flex items-center gap-2">
                                        <ShoppingBag className="size-4" />
                                        <span className="font-medium">Orders</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="cursor-pointer gap-2 text-[13px] text-primary focus:bg-blush focus:text-primary rounded-lg px-3 py-2"
                                >
                                    <LogOut className="size-4 text-primary" />
                                    <span className="font-medium">Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link
                            to="/auth/login"
                            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-ink outline-none transition hover:bg-blush focus-visible:ring-[3px] focus-visible:ring-primary/10 max-md:hidden"
                        >
                            <User className="size-5" />
                            <span className="text-[10px] font-semibold">
                                Login
                            </span>
                        </Link>
                    )}

                    {/* Cart */}
                    <button
                        type="button"
                        aria-label={`Shopping bag with ${cartCount} items`}
                        className="relative inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-ink transition hover:bg-blush"
                    >
                        <ShoppingBag className="size-5" />
                        <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-0.5 text-[9px] text-white">
                            {cartCount}
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
