import { Route, Routes } from "react-router";

import RootLayout from "../layout/RootLayout";

import Home from "../pages/home/Home";

import WhatsAppButton from "@/components/shared/whatsApp/WhatsAppButton";
import ScrollToTop from "@/components/shared/scrollToTop/ScrollToTop";
import Login from "@/pages/auth/login/Login";
import Register from "@/pages/auth/register/Register";
import VerifyEmail from "@/pages/auth/verifyEmail/VerifyEmail";

import AdminDashboardLayout from "@/layout/AdminDashboardLayout";
import AdminDashboard from "@/pages/adminDashboard/AdminDashboard";
import OrdersList from "@/pages/adminDashboard/orders/Orders";
import OrderDetails from "@/pages/adminDashboard/orders/OrderDetails";
import Cakes from "@/pages/adminDashboard/cakes/Cakes";
import AddCakes from "@/pages/adminDashboard/cakes/AddCakes";
import UpdateCake from "@/pages/adminDashboard/cakes/UpdateCake";
import Categories from "@/pages/adminDashboard/categories/Categories";
import AddCategory from "@/pages/adminDashboard/categories/AddCategory";
import EditCategory from "@/pages/adminDashboard/categories/EditCategory";
import AddOns from "@/pages/adminDashboard/addOns/AddOns";
import AddAddOn from "@/pages/adminDashboard/addOns/AddAddOn";
import EditAddOn from "@/pages/adminDashboard/addOns/EditAddOn";
import Customers from "@/pages/adminDashboard/customers/Customers";
import Products from "@/pages/products/Products";

const Router = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route element={<RootLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/category/:slug" element={<Products />} />
                </Route>
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/verify-email" element={<VerifyEmail />} />

                {/* admin routes */}
                <Route path="/admin" element={<AdminDashboardLayout />}>
                    <Route index element={<AdminDashboard />} />

                    <Route path="orders" element={<OrdersList />} />
                    <Route path="orders/pending" element={<OrdersList />} />
                    <Route path="orders/confirmed" element={<OrdersList />} />
                    <Route
                        path="orders/out-for-delivery"
                        element={<OrdersList />}
                    />
                    <Route path="orders/delivered" element={<OrdersList />} />
                    <Route path="orders/cancelled" element={<OrdersList />} />
                    <Route path="orders/:orderId" element={<OrderDetails />} />

                    <Route path="cakes" element={<Cakes />} />
                    <Route path="cakes/add" element={<AddCakes />} />
                    <Route path="cakes/:id" element={<UpdateCake />} />

                    <Route path="categories" element={<Categories />} />
                    <Route path="categories/add" element={<AddCategory />} />
                    <Route path="categories/:id" element={<EditCategory />} />

                    <Route path="add-ons" element={<AddOns />} />
                    <Route path="add-ons/add" element={<AddAddOn />} />
                    <Route path="add-ons/:id" element={<EditAddOn />} />

                    <Route path="customers" element={<Customers />} />
                </Route>
            </Routes>

            <WhatsAppButton />
        </>
    );
};

export default Router;
