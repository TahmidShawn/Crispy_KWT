import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./context/LanguageContext";
import Router from "./router/Router";
import AuthProvider from "./context/AuthProvider";
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <LanguageProvider>
                    <AuthProvider>
                        <Router />
                    </AuthProvider>
                </LanguageProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
);
