import React from "react";
import {
    AppBar,
    Box,
    Button,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../hooks";
import {selectSystemConfig} from "../features/system-config";
import {logout} from "../features/user";
import {Link, useNavigate} from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupIcon from "@mui/icons-material/Group";
import BusinessIcon from "@mui/icons-material/Business";
import {SystemConfigKeys} from "../data/system-config-keys";
import {Bookmarks, MapSharp} from "@mui/icons-material";

export function Navbar() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const brand = useAppSelector(selectSystemConfig(SystemConfigKeys.Brand, 'MultiSpace'));
    const user = useAppSelector(state => state.user.user);

    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(menuAnchorEl);
    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const breakpointMdAndUp = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: 'none',
                        }}
                        color="inherit"
                    >
                        {brand}
                    </Typography>

                    <Box>
                        {

                            breakpointMdAndUp &&
                            <Button
                                component={Link}
                                to="/"
                                color="inherit"
                                sx={{mr: 4}}
                            >
                                Raumplan
                            </Button>
                        }

                        {

                            breakpointMdAndUp &&
                            <Button
                                component={Link}
                                to="/open-bookings"
                                color="inherit"
                                sx={{mr: 4}}
                            >
                                Buchungen
                            </Button>
                        }

                        <IconButton
                            color="inherit"
                            onClick={handleMenuClick}
                        >
                            <MoreVertIcon/>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <Menu
                id="basic-menu"
                anchorEl={menuAnchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >

                <MenuItem
                    onClick={() => {
                        handleMenuClose();
                        navigate('/profile');
                    }}
                >
                    <ListItemIcon>
                        <AccountCircleIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>
                        Profil
                    </ListItemText>
                </MenuItem>

                <Divider/>

                {
                    !breakpointMdAndUp &&
                    <MenuItem
                        onClick={() => {
                            handleMenuClose();
                            navigate('/');
                        }}
                    >
                        <ListItemIcon>
                            <MapSharp fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText>
                            Raumplan
                        </ListItemText>
                    </MenuItem>
                }

                {
                    !breakpointMdAndUp &&
                    <MenuItem
                        onClick={() => {
                            handleMenuClose();
                            navigate('/open-bookings');
                        }}
                    >
                        <ListItemIcon>
                            <Bookmarks fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText>
                            Buchungen
                        </ListItemText>
                    </MenuItem>
                }

                {
                    !breakpointMdAndUp &&
                    <Divider/>
                }

                {
                    user &&
                    user.is_staff &&
                    <MenuItem
                        onClick={() => {
                            handleMenuClose();
                            navigate('/manage-users');
                        }}
                    >
                        <ListItemIcon>
                            <GroupIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText>
                            Nutzerverwaltung
                        </ListItemText>
                    </MenuItem>
                }

                {
                    user &&
                    user.is_staff &&
                    <MenuItem
                        onClick={() => {
                            handleMenuClose();
                            navigate('/manage-floors');
                        }}
                    >
                        <ListItemIcon>
                            <BusinessIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText>
                            Bereichsverwaltung
                        </ListItemText>
                    </MenuItem>
                }

                {
                    user &&
                    user.is_staff &&
                    <MenuItem
                        onClick={() => {
                            handleMenuClose();
                            navigate('/manage-system');
                        }}
                    >
                        <ListItemIcon>
                            <SettingsIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText>
                            Systemeinstellungen
                        </ListItemText>
                    </MenuItem>
                }

                {
                    user &&
                    user.is_staff &&
                    <Divider/>
                }

                <MenuItem
                    onClick={() => {
                        handleMenuClose();
                        dispatch(logout());
                    }}
                >
                    <ListItemIcon>
                        <LogoutIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>
                        Abmelden
                    </ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
}
