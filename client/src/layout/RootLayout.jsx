import BottomBar from "@/components/shared/bottomBar/BottomBar";
import Navbar from "@/components/shared/navbar/Navbar";
import { Outlet, useLocation } from "react-router";

const RootLayout = () => {
    const { pathname } = useLocation();
    const isHome = pathname === "/";

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />

            <main className={`flex-1 ${isHome ? "" : "pt-16 sm:pt-17"}`}>
                <Outlet />
            </main>

            <div
                className="h-[calc(4rem+env(safe-area-inset-bottom))] md:hidden"
                aria-hidden="true"
            />
            <BottomBar />
        </div>
    );
};

export default RootLayout;
