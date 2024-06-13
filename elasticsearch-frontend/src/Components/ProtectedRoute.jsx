import { useAuth } from "../Contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import React from "react";

export default function ProtectedRoute() {

    const { user } = useAuth();

    if (!user) {
        return (
            <Navigate to="/" replace />
        )
    }

    return <Outlet />
}