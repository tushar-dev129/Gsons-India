"use client";

import React, { createContext, useContext } from "react";
import { getMe, loginUser, logoutUser, registerUser, forgotPassword, resetPassword, updatePassword, updateProfile, LoginData } from "@/services/userApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    mobile?: string;
    company?: string;
    avatar?: {
        url: string;
    };
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (userData: LoginData) => Promise<void>;
    register: (formData: FormData) => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, passwords: any) => Promise<void>;
    updatePassword: (passwordData: any) => Promise<void>;
    updateProfile: (profileData: FormData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["me"],
        queryFn: getMe,
        retry: false,
    });

    const user = data?.success ? data.user : null;
    const isAuthenticated = !!user;

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["me"] });
            toast.success("Logged in successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Login failed");
        },
    });

    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["me"] });
            toast.success("Registration successful! Please login.");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Registration failed");
        },
    });

    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.setQueryData(["me"], null);
            queryClient.invalidateQueries({ queryKey: ["me"] });
            toast.success("Logged out successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Logout failed");
        },
    });

    const forgotPasswordMutation = useMutation({
        mutationFn: forgotPassword,
        onSuccess: (data) => {
            toast.success(data.message || "Email sent successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to send email");
        },
    });

    const resetPasswordMutation = useMutation({
        mutationFn: resetPassword,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["me"] });
            toast.success("Password reset successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to reset password");
        },
    });

    const updatePasswordMutation = useMutation({
        mutationFn: updatePassword,
        onSuccess: () => {
            toast.success("Password updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update password");
        },
    });

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (data) => {
            queryClient.setQueryData(["me"], data);
            toast.success("Profile updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update profile");
        },
    });

    const login = async (userData: LoginData) => {
        await loginMutation.mutateAsync(userData);
    };

    const register = async (formData: FormData) => {
        await registerMutation.mutateAsync(formData);
    };

    const logout = async () => {
        await logoutMutation.mutateAsync();
    };

    const handleForgotPassword = async (email: string) => {
        await forgotPasswordMutation.mutateAsync(email);
    };

    const handleResetPassword = async (token: string, passwords: any) => {
        await resetPasswordMutation.mutateAsync({ token, passwords });
    };

    const handleUpdatePassword = async (passwordData: any) => {
        await updatePasswordMutation.mutateAsync(passwordData);
    };

    const handleUpdateProfile = async (profileData: FormData) => {
        await updateProfileMutation.mutateAsync(profileData);
    };

    const loading = isLoading || 
        loginMutation.isPending || 
        registerMutation.isPending || 
        logoutMutation.isPending || 
        forgotPasswordMutation.isPending || 
        resetPasswordMutation.isPending || 
        updatePasswordMutation.isPending || 
        updateProfileMutation.isPending;

    if (isLoading) {
        return <Loader fullPage text=" Loading..." />;
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login,
            register,
            logout,
            forgotPassword: handleForgotPassword,
            resetPassword: handleResetPassword,
            updatePassword: handleUpdatePassword,
            updateProfile: handleUpdateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
