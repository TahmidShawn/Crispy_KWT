import { Route, Routes } from "react-router";

import RootLayout from "../layout/RootLayout";

import Home from "../pages/home/Home";

import WhatsAppButton from "@/components/shared/whatsApp/WhatsAppButton";
import ScrollToTop from "@/components/shared/scrollToTop/ScrollToTop";
import RedirectIfAuthenticated from "@/components/guards/RedirectIfAuthenticated";
import RequireAuth from "@/components/guards/RequireAuth";
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

import ProductDetails from "@/pages/productDetails/ProductDetails";
import Cart from "@/pages/cart/Cart";
import Checkout from "@/pages/checkout/Checkout";

import DashboardLayout from "@/layout/DashboardLayout";
import Dashboard from "@/pages/dashboard/Dashboard";
import Orders from "@/pages/dashboard/orders/Orders";
import UserOrderDetails from "@/pages/dashboard/orders/OrderDetails";
import Addresses from "@/pages/dashboard/addresses/Addresses";
import OrderTracking from "@/pages/orderTracking/OrderTracking";
import PaymentSuccess from "@/pages/paymentResult/PaymentSuccess";
import PaymentFailed from "@/pages/paymentResult/PaymentFailed";

const Router = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* Public routes: anyone (logged in or not) can browse cakes */}
                <Route element={<RootLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/category/:slug" element={<Products />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/cake/:slug" element={<ProductDetails />} />
                    <Route path="/order-tracking" element={<OrderTracking />} />
                </Route>
                {/* Auth routes: only accessible when not logged in */}
                <Route element={<RedirectIfAuthenticated />}>
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/register" element={<Register />} />
                    <Route
                        path="/auth/verify-email"
                        element={<VerifyEmail />}
                    />
                </Route>

                {/* User-only routes: login + user role required */}
                <Route element={<RequireAuth roles={["user"]} />}>
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                </Route>

                {/* User dashboard routes: login + user role required */}
                <Route element={<RequireAuth roles={["user"]} />}>
                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="orders" element={<Orders />} />
                        <Route
                            path="orders/:orderId"
                            element={<UserOrderDetails />}
                        />
                        <Route path="addresses" element={<Addresses />} />
                    </Route>
                </Route>

                {/* Admin-only routes: login + admin role required */}
                <Route element={<RequireAuth roles={["admin"]} />}>
                    <Route path="/admin" element={<AdminDashboardLayout />}>
                        <Route index element={<AdminDashboard />} />

                        <Route path="orders" element={<OrdersList />} />
                        <Route path="orders/pending" element={<OrdersList />} />
                        <Route
                            path="orders/confirmed"
                            element={<OrdersList />}
                        />
                        <Route
                            path="orders/out-for-delivery"
                            element={<OrdersList />}
                        />
                        <Route
                            path="orders/delivered"
                            element={<OrdersList />}
                        />
                        <Route
                            path="orders/cancelled"
                            element={<OrdersList />}
                        />
                        <Route
                            path="orders/:orderId"
                            element={<OrderDetails />}
                        />

                        <Route path="cakes" element={<Cakes />} />
                        <Route path="cakes/add" element={<AddCakes />} />
                        <Route path="cakes/:id" element={<UpdateCake />} />

                        <Route path="categories" element={<Categories />} />
                        <Route
                            path="categories/add"
                            element={<AddCategory />}
                        />
                        <Route
                            path="categories/:id"
                            element={<EditCategory />}
                        />

                        <Route path="add-ons" element={<AddOns />} />
                        <Route path="add-ons/add" element={<AddAddOn />} />
                        <Route path="add-ons/:id" element={<EditAddOn />} />

                        <Route path="customers" element={<Customers />} />
                    </Route>
                </Route>
                 <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failed" element={<PaymentFailed />} />
            </Routes>

            <WhatsAppButton />
        </>
    );
};

export default Router;
