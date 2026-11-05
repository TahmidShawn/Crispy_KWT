import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import AuthContext from "@/context/AuthContext";
import api from "@/api/axios";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const queryClient = useQueryClient();

    const getCurrentUser = async () => {
        try {
            setIsLoading(true);

            const response = await api.get("/auth/me");

            setUser(response.data.data);

            return response.data.data;
        } catch (error) {
            setUser(null);

            return null;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    const isAuthenticated = Boolean(user);

    const clearUserQueries = () => {
        // Remove cached user-specific data (cart, orders, my-review) so that each
        // component refetches with the newly authenticated user's data when the
        // account changes. Without this the TanStack Query cache keeps serving the
        // previous account's data until a full page refresh.
        queryClient.removeQueries({ queryKey: ["cart"] });
        queryClient.removeQueries({ queryKey: ["orders"] });
        queryClient.removeQueries({ queryKey: ["myReview"] });
    };

    const refreshUser = async () => {
        const data = await getCurrentUser();

        // Once the user switches, clear stale caches so the UI (cart badge,
        // orders list, ...) reflects the new account immediately.
        clearUserQueries();

        return data;
    };

    const clearUser = () => {
        setUser(null);
    };

    const logout = () => {
        clearUser();
        clearUserQueries();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                refreshUser,
                clearUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
