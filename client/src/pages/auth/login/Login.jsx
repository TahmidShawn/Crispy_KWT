import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowLeft,
    ArrowUpRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/ui/google-icon";
import { Input } from "@/components/ui/input";

import useAuth from "@/hooks/useAuth";
import usePost from "@/hooks/usePost";
import getRoleHome from "@/utils/roleHome";

const loginSchema = z.object({
    email: z.string().trim().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
});

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { refreshUser } = useAuth();

    const returnTo = location.state?.from
        ? location.state.from.pathname + (location.state.from.search || "")
        : null;

    const redirectAfterLogin = (role) => {
        if (returnTo && !returnTo.startsWith("/auth")) {
            navigate(returnTo, { replace: true });
            return;
        }

        navigate(getRoleHome(role), { replace: true });
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const {
        mutate: loginUser,
        isPending: isLoggingIn,
        error: loginError,
    } = usePost({
        url: "/auth/login",
    });

    const {
        mutate: googleLogin,
        isPending: isGooglePending,
        error: googleError,
    } = usePost({
        url: "/auth/google",
    });

    const loginWithGoogle = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            googleLogin(
                { accessToken: tokenResponse.access_token },
                {
                    onSuccess: async () => {
                        const currentUser = await refreshUser();
                        redirectAfterLogin(currentUser?.role);
                    },
                },
            );
        },
        onError: () => {},
    });

    const isPending = isLoggingIn || isGooglePending;

    const handleLogin = (formData) => {
        loginUser(formData, {
            onSuccess: async () => {
                const currentUser = await refreshUser();
                redirectAfterLogin(currentUser?.role);
            },
        });
    };

    return (
        <main className="min-h-screen">
            <div className="grid min-h-screen md:grid-cols-2">
                <section className="flex min-h-screen items-center justify-center px-5 py-6 sm:px-8 md:py-4 lg:px-12 xl:px-16">
                    <div className="w-full max-w-md">
                        <Link
                            to="/"
                            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            <ArrowLeft className="size-4" />
                            Back to home
                        </Link>

                        <div className="mb-5">
                            <p className="mb-2 text-sm font-semibold text-primary">
                                Welcome back to Crispy Kwt
                            </p>

                            <h1 className="text-3xl mb-8 font-bold tracking-tight text-foreground sm:text-4xl">
                                Sign in to your account
                            </h1>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            aria-label="Continue with Google"
                            disabled={isPending}
                            onClick={() => loginWithGoogle()}
                            className="h-11 rounded-md w-full gap-3  border-border bg-background text-sm font-medium shadow-none transition-colors hover:bg-muted/50"
                        >
                            <GoogleIcon className="size-[18px]" />
                            Continue with Google
                        </Button>

                        {googleError && (
                            <p className="mt-2 text-sm text-destructive">
                                {googleError?.response?.data?.message ||
                                    "Unable to continue with Google. Please try again."}
                            </p>
                        )}

                        <div className="my-5 flex items-center gap-4">
                            <div className="h-px flex-1 bg-border" />

                            <span className="text-xs text-muted-foreground">
                                Or continue with email
                            </span>

                            <div className="h-px flex-1 bg-border" />
                        </div>

                        <form
                            className="space-y-4"
                            onSubmit={handleSubmit(handleLogin)}
                            noValidate
                        >
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Email address
                                </label>

                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                        disabled={isPending}
                                        className="h-11 bg-white rounded-md border-border pl-10 shadow-none focus-visible:border-primary focus-visible:ring-primary/20"
                                        {...register("email")}
                                    />
                                </div>

                                {errors.email && (
                                    <p className="text-sm text-destructive">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between gap-3">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium text-foreground"
                                    >
                                        Password
                                    </label>

                                    <Link
                                        to="/forgot-password"
                                        className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <div className="relative">
                                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        disabled={isPending}
                                        className="h-11 bg-white rounded-md border-border pl-10 pr-11 shadow-none focus-visible:border-primary focus-visible:ring-primary/20"
                                        {...register("password")}
                                    />

                                    <button
                                        type="button"
                                        disabled={isPending}
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </button>
                                </div>

                                {errors.password && (
                                    <p className="text-sm text-destructive">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {loginError && (
                                <p className="text-sm text-destructive">
                                    {loginError?.response?.data?.message ||
                                        "Unable to sign in. Please check your email and password."}
                                </p>
                            )}

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="group/button rounded-md flex h-11 w-full items-center justify-center gap-2  bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-none transition-colors hover:bg-primary/90"
                            >
                                {isLoggingIn ? "Signing in..." : "Sign in"}

                                {!isLoggingIn && (
                                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-foreground text-primary transition-transform duration-300 group-hover/button:rotate-45">
                                        <ArrowUpRight className="size-3.5" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        <p className="mt-5 text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link
                                to="/auth/register"
                                state={location.state}
                                className="font-semibold text-primary transition-colors hover:underline"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </section>

                <section className="relative hidden min-h-screen overflow-hidden md:block">
                    <img
                        src="https://images.unsplash.com/photo-1512223792601-592a9809eed4?w=500&auto=format&fit=crop&q=90"
                        alt="Beautiful celebration cake"
                        className="absolute inset-0 size-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-8 lg:p-12">
                        <h2 className="max-w-lg text-3xl font-semibold leading-tight tracking-tight text-white lg:text-4xl">
                            Make every celebration sweeter.
                        </h2>

                        <p className="mt-3 max-w-md text-sm leading-6 text-white/85">
                            Discover cakes made for your special moments.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Login;
