import { Route, Routes } from "react-router";

import RootLayout from "../layout/RootLayout";

import Home from "../pages/home/Home";

import WhatsAppButton from "@/components/shared/whatsApp/WhatsAppButton";
import ScrollToTop from "@/components/shared/scrollToTop/ScrollToTop";
import Login from "@/pages/auth/login/Login";
import Register from "@/pages/auth/register/Register";
import VerifyEmail from "@/pages/auth/verifyEmail/VerifyEmail";

const Router = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route element={<RootLayout />}>
                    <Route index element={<Home />} />
                </Route>
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/verify-email" element={<VerifyEmail />} />
            </Routes>

            <WhatsAppButton />
        </>
    );
};

export default Router;
