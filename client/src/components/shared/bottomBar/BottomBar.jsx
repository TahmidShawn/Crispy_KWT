import {
    Cake,
    House,
    LayoutGrid,
    LogOut,
    Package,
    User,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/context/LanguageContext";
import useAuth from "@/hooks/useAuth";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";

const BottomBar = () => {
    const { language } = useLanguage();
    const isArabic = language === "ar";
    const { pathname } = useLocation();

    const { isAuthenticated, isLoading, user, clearUser } = useAuth();

    const isAdmin = user?.role === "admin";
    const isCustomer = user?.role === "user";
    const queryClient = useQueryClient();

    const { mutate: logoutUser, isPending: isLoggingOut } = usePost({
        url: "/auth/logout",
        onSuccess: () => {
            clearUser();
            queryClient.removeQueries({ queryKey: ["cart"] });
        },
    });

    const { data: categoriesResponse } = useGet({
        url: "/categories",
        queryKey: ["categories"],
        retry: false,
    });

    const categories = categoriesResponse?.data ?? [];

    const ordersPath = isCustomer ? "/dashboard/orders" : "/order-tracking";

    // Highlight current page
    const isHome = pathname === "/";
    const isOrders = pathname.startsWith(ordersPath);
    const isCategory = pathname.startsWith("/category");

    const itemClass = (active = false) =>
        `flex size-14 flex-col items-center justify-center gap-1 rounded-xl transition-colors active:bg-white/25 data-popup-open:bg-white/20 data-popup-open:text-white ${
            active ? "bg-white/20 text-white" : "text-white/75"
        }`;

    const linkClass =
        "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-ink transition-colors focus:bg-blush focus:text-ink active:bg-blush";

    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/20 bg-transparent pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(144,24,92,0.25)] backdrop-blur-md md:hidden">
            <div className="flex h-16 items-center justify-around">
                <Link to="/" className={itemClass(isHome)}>
                    <House className="size-5" />

                    <span className="text-[10px] font-medium">
                        {isArabic ? "الرئيسية" : "Home"}
                    </span>
                </Link>

                <Popover>
                    <PopoverTrigger
                        render={
                            <button
                                type="button"
                                className={itemClass(isCategory)}
                            />
                        }
                    >
                        <LayoutGrid className="size-5" />

                        <span className="text-[10px] font-medium">
                            {isArabic ? "الفئات" : "Categories"}
                        </span>
                    </PopoverTrigger>

                    <PopoverContent
                        side="top"
                        align="center"
                        sideOffset={12}
                        className="w-72 rounded-2xl border-secondary bg-secondary p-2 shadow-xl shadow-primary/20"
                    >
                        <div className="px-2.5 py-2">
                            <p className="text-sm font-bold text-primary-dark">
                                {isArabic ? "تصفح الفئات" : "Browse categories"}
                            </p>

                            <p className="mt-0.5 text-xs text-primary/70">
                                {isArabic
                                    ? "اختر نوع الكعكة"
                                    : "Choose a cake category"}
                            </p>
                        </div>

                        {categories.length === 0 ? (
                            <p className="px-2.5 py-4 text-center text-xs text-primary/70">
                                {isArabic
                                    ? "لا توجد فئات"
                                    : "No categories available"}
                            </p>
                        ) : (
                            <div className="mt-1 grid max-h-72 grid-cols-2 gap-1.5 overflow-y-auto">
                                {categories.map((category) => (
                                    <Link
                                        key={category._id}
                                        to={`/category/${category.slug}`}
                                        className="rounded-xl border border-secondary bg-white px-2.5 py-2.5 text-xs font-medium text-primary transition-colors active:bg-primary active:text-primary-foreground"
                                    >
                                        {category.name[language]}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </PopoverContent>
                </Popover>

                <Link to={ordersPath} className={itemClass(isOrders)}>
                    <Package className="size-5" />

                    <span className="text-[10px] font-medium">
                        {isArabic ? "الطلبات" : "Orders"}
                    </span>
                </Link>

                {isLoading ? (
                    <div className={itemClass()}>
                        <User className="size-5" />
                        <span className="text-[10px] font-medium">
                            {isArabic ? "الحساب" : "Account"}
                        </span>
                    </div>
                ) : isAuthenticated ? (
                    <Popover>
                        <PopoverTrigger
                            render={
                                <button type="button" className={itemClass()} />
                            }
                        >
                            <User className="size-5" />

                            <span className="text-[10px] font-medium">
                                {isArabic ? "الحساب" : "Account"}
                            </span>
                        </PopoverTrigger>

                        <PopoverContent
                            side="top"
                            align="end"
                            sideOffset={12}
                            className="w-56 border-ink/10 bg-white text-ink shadow-md rounded-lg p-1"
                        >
                            <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-none rounded-tl-xl rounded-br-xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
                                    <Cake className="size-4" />
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold text-primary-dark">
                                        {isArabic ? "حسابي" : "My account"}
                                    </p>

                                    <p className="text-[11px] text-primary/70">
                                        {isArabic
                                            ? "إدارة حسابك"
                                            : "Manage your account"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-2 space-y-1">
                                <Link
                                    to={isAdmin ? "/admin" : "/dashboard"}
                                    className={linkClass}
                                >
                                    <LayoutGrid className="size-4" />
                                    {isAdmin
                                        ? isArabic
                                            ? "لوحة الإدارة"
                                            : "Admin Panel"
                                        : isArabic
                                          ? "لوحة التحكم"
                                          : "Dashboard"}
                                </Link>

                                <button
                                    type="button"
                                    disabled={isLoggingOut}
                                    onClick={() => logoutUser()}
                                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-primary transition-colors focus:bg-blush focus:text-primary active:bg-blush disabled:pointer-events-none disabled:opacity-50"
                                >
                                    <LogOut className="size-4" />
                                    {isLoggingOut
                                        ? isArabic
                                            ? "جاري الخروج..."
                                            : "Logging out..."
                                        : isArabic
                                          ? "تسجيل الخروج"
                                          : "Logout"}
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <Link to="/auth/login" className={itemClass()}>
                        <User className="size-5" />

                        <span className="text-[10px] font-medium">
                            {isArabic ? "الدخول" : "Login"}
                        </span>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default BottomBar;
