import { useEffect, useRef, useState } from "react";
import {
    Search,
    User,
    ShoppingBag,
    LayoutDashboard,
    LogOut,
    Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
import useAuth from "@/hooks/useAuth";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";
import { languages } from "@/data/data";
import { Link, useNavigate } from "react-router";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/crispyK.png";
const menuItem =
    "cursor-pointer rounded-md p-0 text-primary focus:bg-blush focus:text-primary";

const menuInner =
    "flex h-9 w-full items-center gap-2 px-3 text-[13px] font-medium text-primary";

// Search text suggestions
const searchSuggestions = [
    "Birthday",
    "Birthday Cake",
    "Black Forest",
    "Blueberry",
    "Brownie",
    "Butterscotch",
    "Chocolate",
    "Chocolate Cake",
    "Cheesecake",
    "Cherry",
    "Red Velvet",
    "Strawberry",
    "Vanilla",
    "White Chocolate",
    "Caramel",
    "Coffee",
    "Oreo",
    "Pistachio",
    "Lotus",
    "Mango",
];

const Navbar = () => {
    const navigate = useNavigate();
    const searchRef = useRef(null);

    const [search, setSearch] = useState("");
    const [suggestionsOpen, setSuggestionsOpen] = useState(false);

    const { language, setLanguage, t } = useLanguage();
    const n = t.navbar;

    const { isAuthenticated, isLoading, logout, user } = useAuth();
    const isAdmin = user?.role === "admin";

    // Cart
    const { data: cartResponse } = useGet({
        url: "/cart",
        queryKey: ["cart"],
        retry: false,
    });

    const cartData = cartResponse?.data;

    const itemsCount =
        cartData?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;

    // Logout
    const { mutate: logoutUser, isPending: isLoggingOut } = usePost({
        url: "/auth/logout",
        onSuccess: () => {
            logout();
        },
    });

    // Filter text suggestions
    const filteredSuggestions = search.trim()
        ? searchSuggestions
              .filter((item) =>
                  item.toLowerCase().includes(search.trim().toLowerCase()),
              )
              .slice(0, 6)
        : [];

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setSuggestionsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Search input
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setSuggestionsOpen(true);
    };

    // Select text suggestion
    const handleSuggestionSelect = (suggestion) => {
        setSearch(suggestion);
        setSuggestionsOpen(false);
    };

    // Submit search
    const handleSearchSubmit = (e) => {
        e.preventDefault();

        const query = search.trim();

        setSuggestionsOpen(false);

        if (query) {
            navigate(`/products?query=${encodeURIComponent(query)}`);
        }
    };

    const changeLanguage = (code) => {
        setLanguage(code);
    };

    const handleLogout = () => {
        logoutUser();
    };

    return (
        <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md">
            <div className="wrapper flex min-h-[60px] flex-wrap items-center justify-between gap-3 py-3 md:h-[68px] md:flex-nowrap md:py-0">
                {/* Brand */}
                <Link
                    to="/"
                    onClick={() =>
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                        })
                    }
                    aria-label={n.brandLabel}
                    dir="ltr"
                    className="inline-flex shrink-0 items-center gap-2.5"
                >
                    <img
                        src={logo}
                        alt=""
                        className="size-10 shrink-0 object-contain md:size-13"
                    />

                    <span className="whitespace-nowrap font-serif text-xl font-semibold tracking-[-0.04em] md:text-2xl">
                        CRISPY <span className="text-pink">KWT</span>
                    </span>
                </Link>

                {/* Search */}
                <div
                    ref={searchRef}
                    className="relative order-3 w-full md:order-none md:w-[min(470px,42vw)]"
                >
                    <form
                        role="search"
                        onSubmit={handleSearchSubmit}
                        className="relative z-10 flex h-10 items-center gap-2.5 rounded-full border border-ink/15 bg-white ps-4 pe-1 transition focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/10"
                    >
                        <Search className="size-4 shrink-0 text-ink/60" />

                        <Input
                            value={search}
                            onChange={handleSearchChange}
                            onFocus={() => {
                                if (search.trim()) {
                                    setSuggestionsOpen(true);
                                }
                            }}
                            placeholder={n.searchPlaceholder}
                            aria-label={n.searchLabel}
                            autoComplete="off"
                            className="h-auto min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-ink shadow-none placeholder:text-ink/50 focus-visible:ring-0"
                        />

                        <Button
                            type="submit"
                            className="h-8 shrink-0 rounded-full bg-primary px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-white hover:bg-primary/90 rtl:text-xs rtl:tracking-normal"
                        >
                            {n.searchButton}
                        </Button>
                    </form>

                    {/* Text Autocomplete */}
                    {suggestionsOpen && filteredSuggestions.length > 0 && (
                        <div className="absolute start-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-ink/10 bg-white p-1.5 shadow-lg">
                            {filteredSuggestions.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() =>
                                        handleSuggestionSelect(suggestion)
                                    }
                                    className="w-full rounded-lg px-3 py-2.5 text-start text-sm font-medium text-ink transition-colors hover:bg-blush"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Language Toggle */}
                    <div
                        role="group"
                        aria-label={n.chooseLanguage}
                        dir="ltr"
                        className="inline-flex h-9 items-center rounded-full border border-ink/15 bg-white p-0.5"
                    >
                        {languages.map((l) => (
                            <button
                                key={l.code}
                                type="button"
                                onClick={() => changeLanguage(l.code)}
                                aria-pressed={language === l.code}
                                className={`h-full cursor-pointer rounded-full px-3 text-xs font-semibold transition ${
                                    language === l.code
                                        ? "bg-primary text-white"
                                        : "text-ink/70 hover:text-ink"
                                }`}
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>

                    {/* Orders */}
                    {isAuthenticated && !isAdmin && (
                        <Link
                            to="/order-tracking"
                            aria-label={n.orders}
                            className="hidden size-9 cursor-pointer items-center justify-center rounded-full text-ink transition hover:bg-blush focus-visible:ring-[3px] focus-visible:ring-primary/10 md:inline-flex"
                        >
                            <Package className="size-5" />
                        </Link>
                    )}

                    {/* Auth State */}
                    {isLoading ? (
                        <button
                            type="button"
                            aria-label={n.loading}
                            className="inline-flex size-9 cursor-wait items-center justify-center rounded-full text-ink outline-none transition hover:bg-blush focus-visible:ring-[3px] focus-visible:ring-primary/10"
                        >
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </button>
                    ) : isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    aria-label={n.account}
                                    className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-ink outline-none transition hover:bg-blush focus-visible:ring-[3px] focus-visible:ring-primary/10 max-md:hidden"
                                >
                                    <User className="size-5" />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-56 rounded-lg border-ink/10 bg-white p-1 text-ink shadow-md"
                            >
                                <DropdownMenuItem asChild className={menuItem}>
                                    <Link
                                        to={isAdmin ? "/admin" : "/dashboard"}
                                        className={menuInner}
                                    >
                                        <LayoutDashboard className="size-4" />
                                        <span>{n.dashboard}</span>
                                    </Link>
                                </DropdownMenuItem>

                                {isAdmin && (
                                    <DropdownMenuItem
                                        asChild
                                        className={menuItem}
                                    >
                                        <Link
                                            to="/admin/orders"
                                            className={menuInner}
                                        >
                                            <ShoppingBag className="size-4" />
                                            <span>{n.orders}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className={`${menuItem} ${menuInner}`}
                                >
                                    <LogOut className="size-4" />
                                    <span>{n.logout}</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link
                            to="/auth/login"
                            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-white px-3.5 text-xs font-semibold text-ink outline-none transition hover:bg-blush focus-visible:ring-[3px] focus-visible:ring-primary/10 max-md:hidden"
                        >
                            <User className="size-4" />
                            <span>{n.login}</span>
                        </Link>
                    )}

                    {/* Cart */}
                    {!isAdmin && (
                        <Link
                            to="/cart"
                            aria-label={n.cartLabel.replace(
                                "{count}",
                                itemsCount,
                            )}
                            className="relative inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-ink transition hover:bg-blush"
                        >
                            <ShoppingBag className="size-5" />

                            {itemsCount > 0 && (
                                <span className="absolute end-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                                    {itemsCount > 9 ? "9+" : itemsCount}
                                </span>
                            )}
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
