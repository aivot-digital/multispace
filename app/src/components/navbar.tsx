import React from "react";
import {
    AppBar,
    Box,
    Button, Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography
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
import TvIcon from "@mui/icons-material/Tv";
import {SystemConfigKeys} from "../data/system-config-keys";

export function Navbar() {
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
                        <Button
                            component={Link}
                            to="/"
                            color="inherit"
                            sx={{mr: 4}}
                        >
                            Raumplan
                        </Button>


                        <Button
                            component={Link}
                            to="/open-bookings"
                            color="inherit"
                            sx={{mr: 4}}
                        >
                            Buchungen
                        </Button>

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
                            navigate('/manage-displays');
                        }}
                    >
                        <ListItemIcon>
                            <TvIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText>
                            Anzeigeverwaltung
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

                <Divider/>

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
