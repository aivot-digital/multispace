import {
    Avatar,
    Box,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import {Floor} from "../models/floor";
import {Desk} from "../models/desk";
import {Room} from "../models/room";
import {Bookmark, BookmarkBorder, Map} from "@mui/icons-material";
import {DeskBookingWithUser} from "../models/desk-booking";
import {RoomBookingWithUser} from "../models/room-booking";
import {format, parseISO} from "date-fns";


interface FloorListProps {
    floor: Floor;

    desks: Desk[];
    rooms: Room[];

    deskBookings?: DeskBookingWithUser[];
    roomBookings?: RoomBookingWithUser[];

    onDeskClick: (desk: Desk) => void;
    onRoomClick: (room: Room) => void;

    onSwitchLayout: () => void;
}

export function FloorList(props: FloorListProps) {
    const theme = useTheme();

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <Tooltip title="Als Raumplan anzeigen">
                    <Button
                        onClick={props.onSwitchLayout}
                        variant="contained"
                        size="small"
                        sx={{
                            minWidth: '0',
                        }}
                    >
                        <Map/>
                    </Button>
                </Tooltip>
            </Box>

            <Typography>
                Tische
            </Typography>
            <List>
                {
                    props.desks.map(desk => {
                        const booking = (props.deskBookings ?? []).find(bk => bk.desk === desk.id);
                        return (
                            <ListItemButton
                                key={desk.id}
                                onClick={() => props.onDeskClick(desk)}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        sx={{
                                            backgroundColor: booking != null ? theme.palette.warning.main : theme.palette.success.main,
                                        }}
                                    >
                                        {
                                            booking != null ? <Bookmark/> : <BookmarkBorder/>
                                        }
                                    </Avatar>
                                </ListItemAvatar>

                                <ListItemText
                                    secondary={
                                        booking != null ? (
                                            <>Gebucht durch <strong>{booking.user.username}</strong></>
                                        ) : (
                                            <strong>Frei</strong>
                                        )
                                    }
                                >
                                    {desk.name}
                                </ListItemText>
                            </ListItemButton>
                        )
                    })
                }
            </List>

            <Typography>
                Räume
            </Typography>
            <List>
                {
                    props.rooms.map(room => {
                        const bookings = (props.roomBookings ?? []).filter(bk => bk.room === room.id);
                        return (
                            <>
                                <ListItemButton
                                    key={room.id}
                                    onClick={() => props.onRoomClick(room)}
                                >
                                    <ListItemText>
                                        {room.name}
                                    </ListItemText>
                                </ListItemButton>

                                {
                                    bookings.length > 0 &&
                                    <List
                                        component="div"
                                        disablePadding
                                    >
                                        {

                                            bookings.map(bk => (
                                                <ListItem
                                                    key={bk.id}
                                                    sx={{ml: 2}}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            sx={{
                                                                backgroundColor: theme.palette.warning.main,
                                                            }}
                                                        >
                                                            <Bookmark/>
                                                        </Avatar>
                                                    </ListItemAvatar>

                                                    <ListItemText
                                                        secondary={bk.user.username}
                                                    >
                                                        {format(parseISO(bk.start), 'HH:mm')} - {format(parseISO(bk.end), 'HH:mm')} Uhr
                                                    </ListItemText>
                                                </ListItem>
                                            ))
                                        }
                                    </List>
                                }
                            </>
                        );
                    })
                }
            </List>
        </Box>
    );
}