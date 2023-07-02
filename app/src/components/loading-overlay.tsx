import {Backdrop, CircularProgress} from "@mui/material";
import React from "react";
import {useAppSelector} from "../hooks";

export function LoadingOverlay() {
    const isLoading = useAppSelector(state => state.app.showLoading);

    return (
        <Backdrop
            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
            open={isLoading}
        >
            <CircularProgress color="inherit"/>
        </Backdrop>
    );
}