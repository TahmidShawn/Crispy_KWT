import BottomBar from "@/components/shared/bottomBar/BottomBar";
import Footer from "@/components/shared/footer/Footer";
import Navbar from "@/components/shared/navbar/Navbar";
import { Outlet, useLocation } from "react-router";

import usePageView from "@/hooks/usePageView";
import { PageHead } from "@/components/shared/PageHead";
import { usePageTitle } from "@/hooks/usePageTitle";
import SmoothScroll from "@/components/SmoothScroll";

const RootLayout = () => {
    const { pathname } = useLocation();
    const isHome = pathname === "/";

    // Derive + apply the dynamic browser title for this route.
    usePageTitle();

    // GA4 page_view on every route change
    usePageView();

    return (
        <div className="flex min-h-screen flex-col">
            <PageHead />
            <SmoothScroll />
            <Navbar />

            <main
                className={`flex-1 ${isHome ? "pt-0" : "pt-2 md:pt-[2.5px]"}`}
            >
                <Outlet />
            </main>

            <div
                className="h-[calc(4rem+env(safe-area-inset-bottom))] md:hidden"
                aria-hidden="true"
            />
            <Footer />
            <BottomBar />
        </div>
    );
};

export default RootLayout;
