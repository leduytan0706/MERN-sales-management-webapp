import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import AccessDeniedCard from "./AccessDeniedCard";
import { Backdrop } from "@mui/material";

const ProtectedRoute = ({allowedRoles}) => {
    const {authUser} = useAuthStore();
    const hasAccess = authUser.roles.some(role => allowedRoles.includes(role));

    if (!hasAccess){
        return (
            <Backdrop 
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={true}
            >
                <AccessDeniedCard />
            </Backdrop>
        )
    }
    
    // nếu có quyền, trả lại component con
    return <Outlet />;
};

export default ProtectedRoute;