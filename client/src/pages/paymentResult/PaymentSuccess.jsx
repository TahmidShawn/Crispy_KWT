import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import useGet from "@/hooks/useGet";

import usePurchase from "@/hooks/usePurchase";
import useAuth from "@/hooks/useAuth";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();

    const orderId = searchParams.get("orderId");

    useEffect(() => {
        queryClient.invalidateQueries({
            queryKey: ["cart"],
        });
    }, [queryClient]);

    const {
        data: orderResponse,
        isLoading,
        isError,
    } = useGet({
        url: `/order/${orderId}`,
        queryKey: ["order", orderId],
        retry: false,
        enabled: Boolean(orderId),
        refetchInterval: (query) => {
            const order = query.state.data?.data;

            if (order?.paymentStatus === "paid") {
                return false;
            }

            if (
                order?.paymentStatus === "failed" ||
                order?.orderStatus === "cancelled"
            ) {
                return false;
            }

            return 3000;
        },
    });

    const order = orderResponse?.data;

    // TODO: Replace 0 with actual order count from backend API
    // to properly classify new vs returning customers.
    usePurchase({
        order,
        customerInfo: {
            email: user?.email || "",
            firstName: user?.username ? user.username.split(" ")[0] : "",
            lastName: user?.username
                ? user.username.split(" ").slice(1).join(" ") || ""
                : "",
            phone: user?.phone || "",
        },
        orderCount: 0,
    });

    const orderNumber = order?.orderNumber;
    const isPaymentConfirmed = order?.paymentStatus === "paid";

    return (
        <>
            <main className="wrapper py-10 md:py-14">
                <div className="mx-auto max-w-2xl border border-border bg-card p-8 text-center md:p-12">
                    <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="size-8" />
                    </div>

                    <p className="mb-2 text-sm font-semibold tracking-wider text-primary uppercase">
                        {isPaymentConfirmed
                            ? "Payment successful"
                            : "Payment confirmation"}
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                        {isPaymentConfirmed
                            ? "Thank you, your order is confirmed"
                            : "Your payment is being confirmed"}
                    </h1>

                    <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                        {isPaymentConfirmed
                            ? "We received your payment and started preparing your order. You can follow its progress from your orders page."
                            : "We are checking your payment status. Your order details will be available once confirmation is complete."}
                    </p>

                    {isLoading && (
                        <p className="mt-4 text-sm text-muted-foreground">
                            Loading order details...
                        </p>
                    )}

                    {isError && (
                        <p className="mt-4 text-sm text-destructive">
                            Unable to load your order details. Please check your
                            orders page.
                        </p>
                    )}

                    {orderNumber && (
                        <div className="mt-6 border border-border bg-background p-4">
                            <p className="text-xs text-muted-foreground">
                                Order number
                            </p>

                            <p className="mt-1 font-semibold">{orderNumber}</p>
                        </div>
                    )}

                    <div className="mt-8 flex flex-col justify-center gap-3 md:flex-row">
                        <Button
                           className={'p-5'}
                            size="lg"
                            onClick={() => navigate("/")}
                        >
                            Continue shopping
                        </Button>

                        <Button
                           className={'p-5'}
                            size="lg"
                            onClick={() => navigate("/dashboard/orders")}
                        >
                            View orders
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </main>
        </>
    );
};

export default PaymentSuccess;
