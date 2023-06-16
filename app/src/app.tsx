import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {LoginPage} from "./pages/login-page";
import {useAppDispatch, useAppSelector} from "./hooks";
import {fetchSystemConfig} from "./features/system-config";
import {fetchUser} from "./features/user";
import {Navbar} from "./components/navbar";
import {Backdrop, Box, CircularProgress} from "@mui/material";
import {SystemSettingsPage} from "./pages/system-settings-page";
import {ManageFloorsPage} from "./pages/manage-floors-page";
import {ManageFloorsEditPage} from "./pages/manage-floors-edit-page";
import {FloorsPage} from "./pages/floors-page";
import {ProfilePage} from "./pages/profile-page";
import {BookingsPage} from "./pages/bookings-page";


export function App() {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user.user);
    const userId = useAppSelector(state => state.user.userId);
    const isLoading = useAppSelector(state => state.app.showLoading);

    useEffect(() => {
        dispatch(fetchSystemConfig())
    }, []);

    useEffect(() => {
        if (userId != null) {
            dispatch(fetchUser(userId));
        }
    }, [userId]);

    if (user == null) {
        return <LoginPage/>;
    }

    return (
        <Router>
            <Navbar/>

            <Box sx={{p: 4}}>
                <Routes>
                    <Route
                        path="/"
                        element={<FloorsPage/>}
                    />

                    <Route
                        path="/open-bookings"
                        element={<BookingsPage/>}
                    />

                    <Route
                        path="/manage-system"
                        element={<SystemSettingsPage/>}
                    />

                    <Route
                        path="/manage-floors"
                        element={<ManageFloorsPage/>}
                    />

                    <Route
                        path="/manage-floors/edit"
                        element={<ManageFloorsEditPage/>}
                    />

                    <Route
                        path="/manage-floors/edit/:id"
                        element={<ManageFloorsEditPage/>}
                    />

                    <Route
                        path="/profile"
                        element={<ProfilePage/>}
                    />

                    <Route
                        path="*"
                        element={<div>Not FOUND</div>}
                    />
                </Routes>
            </Box>

            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={isLoading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        </Router>
    );
}
