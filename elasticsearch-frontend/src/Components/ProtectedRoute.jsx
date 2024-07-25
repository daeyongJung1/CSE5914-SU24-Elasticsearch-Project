import { useAuth } from "../Contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import React from "react";

export default function ProtectedRoute({ children }) {
    const { user, loadingAuth } = useAuth();

    if (loadingAuth) {
        return (
            <div>Loading...</div>
        );
    }

    if (!user) {
        return (
            <Navigate to="/" replace />
        );
    }

    return (
        <>
            {children}
        </>
    );
}
