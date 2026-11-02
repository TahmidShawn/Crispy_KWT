import { useEffect, useRef, useState } from "react";
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
import useGet from "@/hooks/useGet";
import { languages } from "@/data/data";
import { Link, useNavigate } from "react-router";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItem =
    "cursor-pointer rounded-md p-0 text-primary focus:bg-blush focus:text-primary";
const menuInner =
    "flex h-9 w-full items-center gap-2 px-3 text-[13px] font-medium text-primary";

const Navbar = () => {
    const { data: cartResponse } = useGet({
        url: "/cart",
        queryKey: ["cart"],
        retry: false,
    });

    const cartData = cartResponse?.data;
    const itemsCount =
        cartData?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;

    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionsOpen, setSuggestionsOpen] = useState(false);
    const debounceRef = useRef(null);

    const { language, setLanguage, t } = useLanguage();
    const n = t.navbar;
    const { isAuthenticated, isLoading, clearUser, user } = useAuth();
    const isAdmin = user?.role === "admin";
    const { mutate: logoutUser, isPending: isLoggingOut } = usePost({
        url: "/auth/logout",
        onSuccess: () => {
            clearUser();
        },
    });

    const {
        data: suggestionsResponse,
        isLoading: suggestionsLoading,
    } = useGet({
        url: "/cakes/search-suggestions",
        params: search ? { q: search } : undefined,
        queryKey: ["cake-suggestions", search],
        enabled: Boolean(search) && search.length >= 1,
        retry: false,
    });

    useEffect(() => {
        if (suggestionsResponse?.success) {
            setSuggestions(suggestionsResponse.suggestions ?? []);
        }
    }, [suggestionsResponse]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (value.trim()) {
            debounceRef.current = setTimeout(() => {
                setSuggestionsOpen(true);
            }, 300);
        } else {
            setSuggestions([]);
            setSuggestionsOpen(false);
        }
    };

    const handleSuggestionSelect = (slug) => {
        setSearch("");
        setSuggestions([]);
        setSuggestionsOpen(false);
        navigate(`/cake/${slug}`);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSuggestionsOpen(false);
        if (search.trim()) {
            navigate(`/products?query=${encodeURIComponent(search.trim())}`);
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
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    aria-label={n.brandLabel}
                    dir="ltr"
                    className="font-serif text-xl font-semibold tracking-[-0.04em] md:text-2xl"
                >
                    CRISPY <span className="text-pink">KWT</span>
                </Link>

                {/* Search */}
                <form
                    role="search"
                    onSubmit={handleSearchSubmit}
                    className="order-3 flex h-10 w-full items-center gap-2.5 rounded-full border border-ink/15 bg-white ps-4 pe-1 transition focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/10 md:order-none md:w-[min(470px,42vw)]"
                >
                    <Search className="size-4 shrink-0 text-ink/60" />
                    <Input
                        value={search}
                        onChange={handleSearchChange}
                        onFocus={() => {
                            if (search.trim()) setSuggestionsOpen(true);
                        }}
                        onBlur={() => {
                            setTimeout(() => setSuggestionsOpen(false), 150);
                        }}
                        placeholder={n.searchPlaceholder}
                        aria-label={n.searchLabel}
                        className="h-auto min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-ink shadow-none placeholder:text-ink/50 focus-visible:ring-0"
                    />
                    <Button
                        type="submit"
                        className="h-8 rounded-full bg-primary px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-white hover:bg-primary/90 rtl:text-xs rtl:tracking-normal"
                    >
                        {n.searchButton}
                    </Button>
                </form>

                {/* Search Suggestions Dropdown */}
                {suggestionsOpen && suggestions.length > 0 && !suggestionsLoading && (
                    <div
                        className="absolute z-50 mt-1 w-[min(470px,42vw)] rounded-lg border border-ink/10 bg-cream px-2.5 shadow-sm md:w-full"
                    >
                        <div className="max-h-56 overflow-y-auto">
                            {suggestions.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleSuggestionSelect(item.slug)}
                                    className="flex w-full items-center gap-3 px-3 py-2 text-sm text-ink transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-blush"
                                >
                                    <span className="flex-1 truncate font-medium text-ink">
                                        {language === "ar"
                                            ? item.name.ar
                                            : item.name.en}
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Language toggle */}
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

                    {/* Auth state */}
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

                    {/* Cart (hidden for admin: admins cannot purchase) */}
                    {!isAdmin && (
                        <Link to="/cart">
                            <button
                                type="button"
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
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;