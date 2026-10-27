import { Route, Routes } from "react-router";

import RootLayout from "../layout/RootLayout";

import Home from "../pages/home/Home";

import WhatsAppButton from "@/components/shared/whatsApp/WhatsAppButton";
import ScrollToTop from "@/components/shared/scrollToTop/ScrollToTop";

const Router = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route element={<RootLayout />}>
                    <Route index element={<Home />} />
                </Route>
            </Routes>

            <WhatsAppButton />
        </>
    );
};

export default Router;
