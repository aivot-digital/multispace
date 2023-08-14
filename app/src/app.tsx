import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {LoginPage} from "./pages/login-page";
import {useAppDispatch, useAppSelector} from "./hooks";
import {fetchSystemConfig, selectSystemConfig} from "./features/system-config";
import {fetchUser} from "./features/user";
import {Navbar} from "./components/navbar";
import {Box, Typography, useTheme} from "@mui/material";
import {SystemSettingsPage} from "./pages/system-settings-page";
import {ManageFloorsPage} from "./pages/manage-floors-page";
import {ManageFloorsEditPage} from "./pages/manage-floors-edit-page";
import {FloorsPage} from "./pages/floors-page";
import {ProfilePage} from "./pages/profile-page";
import {BookingsPage} from "./pages/bookings-page";
import {DeskPage} from "./pages/desk-page";
import {RoomPage} from "./pages/room-page";
import {ManageUsersPage} from "./pages/manage-users-page";
import {MessageBoard} from "./components/message-board";
import {LoadingOverlay} from "./components/loading-overlay";
import {Helmet} from "react-helmet";
import {SystemConfigKeys} from "./data/system-config-keys";
import {DisplayPage} from "./pages/display-page";


export function App() {
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user.user);
    const userId = useAppSelector(state => state.user.userId);
    const brand = useAppSelector(selectSystemConfig(SystemConfigKeys.Brand, 'MultiSpace'));

    useEffect(() => {
        dispatch(fetchSystemConfig())
    }, []);

    useEffect(() => {
        if (userId != null) {
            dispatch(fetchUser(userId));
        }
    }, [userId]);

    if (window.location.hash != null && window.location.hash.length > 0) {
        return (
            <DisplayPage
                displayKey={window.location.hash.substring(1)}
            />
        );
    }

    if (user == null) {
        return (
            <LoginPage
                brand={brand}
            />
        );
    }

    return (
        <Router>
            <Helmet>
                <title>MultiSpace - {brand}</title>
            </Helmet>

            <Navbar/>

            <Box
                sx={{
                    py: 4,
                    px: 1,
                    [theme.breakpoints.up('sm')]: {
                        px: 4,
                    },
                }}
            >
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
                        path="/desks/:id"
                        element={<DeskPage/>}
                    />

                    <Route
                        path="/rooms/:id"
                        element={<RoomPage/>}
                    />

                    <Route
                        path="/manage-users"
                        element={<ManageUsersPage/>}
                    />

                    <Route
                        path="/profile"
                        element={<ProfilePage/>}
                    />

                    <Route
                        path="*"
                        element={(
                            <Box>
                                <Typography variant="h5" component="h1">
                                    Hoppla!
                                </Typography>

                                <Typography>
                                    Die von Ihnen aufgerufene Seite konnte nicht gefunden werden.
                                </Typography>
                            </Box>
                        )}
                    />
                </Routes>
            </Box>

            <MessageBoard/>

            <LoadingOverlay/>
        </Router>
    );
}
