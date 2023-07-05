import {
    Avatar,
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tooltip,
    useTheme
} from "@mui/material";
import {Floor} from "../models/floor";
import {Desk, isDisplayDesk} from "../models/desk";
import {isDisplayRoom, Room} from "../models/room";
import {Bookmark, BookmarkBorder, Map} from "@mui/icons-material";
import {DeskBookingWithUser} from "../models/desk-booking";
import {RoomBookingWithUser} from "../models/room-booking";
import {format, isAfter, isBefore, parseISO} from "date-fns";


interface FloorListProps {
    floor: Floor;

    desks: Desk[];
    rooms: Room[];

    deskBookings?: DeskBookingWithUser[];
    roomBookings?: RoomBookingWithUser[];

    onDeskClick?: (desk: Desk) => void;
    onRoomClick?: (room: Room) => void;

    onSwitchLayout?: () => void;
}

export function FloorList(props: FloorListProps) {
    return (
        <Box>
            {
                props.onSwitchLayout &&
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
            }

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexFlow: 'column wrap',
                    gap: '1em',
                    overflow: 'auto',
                    height: 'calc(100vh - 64px)',
                }}
            >
                {
                    props.desks.length > 0 &&
                    <Divider>
                        Tische
                    </Divider>
                }
                {
                    props.desks.map(desk => (
                        <DeskCard
                            key={desk.id}
                            desk={desk}
                            bookings={props.deskBookings}
                            onClick={props.onDeskClick}
                        />
                    ))
                }

                {
                    props.rooms.length > 0 &&
                    <Divider>
                        Räume
                    </Divider>
                }
                {
                    props.rooms.map(room => (
                        <RoomCard
                            key={room.id}
                            room={room}
                            bookings={props.roomBookings}
                            onClick={props.onRoomClick}
                        />
                    ))
                }
            </Box>
        </Box>
    );
}

function DeskCard(props: { desk: Desk; onClick?: (desk: Desk) => void; bookings?: DeskBookingWithUser[] }) {
    const theme = useTheme();

    let isBlocked = false;
    let blockedByUser = undefined;

    if (isDisplayDesk(props.desk)) {
        isBlocked = props.desk.is_blocked;
        blockedByUser = props.desk.booking_user;
    } else if (props.bookings != null) {
        const booking = props.bookings.find(bk => bk.desk === props.desk.id);
        if (booking != null) {
            isBlocked = true;
            blockedByUser = booking.user.username;
        }
    }

    const handleClick = () => {
        if (props.onClick != null) {
            props.onClick(props.desk)
        }
    };

    return (
        <Card>
            <CardActionArea onClick={handleClick}>
                <CardHeader
                    avatar={
                        <Avatar
                            sx={{
                                backgroundColor: isBlocked ? theme.palette.warning.main : theme.palette.success.main,
                            }}
                        >
                            {
                                isBlocked ? <Bookmark/> : <BookmarkBorder/>
                            }
                        </Avatar>
                    }
                    title={props.desk.name}
                    subheader={isBlocked ? (blockedByUser ?? 'Gebucht') : 'Frei'}
                    subheaderTypographyProps={{
                        sx: {
                            fontWeight: isBlocked ? 'bold' : undefined,
                        }
                    }}
                />
            </CardActionArea>
        </Card>
    );
}

function RoomCard(props: { room: Room; onClick?: (room: Room) => void; bookings?: RoomBookingWithUser[] }) {
    const theme = useTheme();

    const now = new Date();

    let isBlocked = false;
    let blockedByUser: string | undefined = undefined;
    const blockings: { start: Date, end: Date, user?: string }[] = [];

    if (isDisplayRoom(props.room)) {
        if (props.room.is_blocked) {
            isBlocked = true;
            blockedByUser = props.room.booking_user;
            blockings.push({
                start: new Date(),
                end: new Date(),
                user: props.room.booking_user,
            });
        }
    } else if (props.bookings != null) {
        const bookings = props.bookings.filter(bk => bk.room === props.room.id);
        isBlocked = bookings.length > 0;
        for (const bk of bookings) {
            const start = parseISO(bk.start);
            const end = parseISO(bk.end);

            blockings.push({
                start: start,
                end: end,
                user: bk.user.username,
            });

            if (isAfter(now, start) && isBefore(now, end)) {
                blockedByUser = bk.user.username;
            }
        }
    }

    const handleClick = () => {
        if (props.onClick != null) {
            props.onClick(props.room)
        }
    };

    return (
        <Card>
            <CardActionArea onClick={handleClick}>
                <CardHeader
                    avatar={
                        <Avatar
                            sx={{
                                backgroundColor: isBlocked ? theme.palette.warning.main : theme.palette.success.main,
                            }}
                        >
                            {
                                isBlocked ? <Bookmark/> : <BookmarkBorder/>
                            }
                        </Avatar>
                    }
                    title={props.room.name}
                    subheader={isBlocked ? (blockedByUser ?? 'Gebucht') : 'Frei'}
                    subheaderTypographyProps={{
                        sx: {
                            fontWeight: isBlocked ? 'bold' : undefined,
                        }
                    }}
                />

                {
                    blockings.length > 1 &&
                    <CardContent>
                        <List disablePadding>
                            {
                                blockings.map(({start, end, user}) => (
                                    <ListItem
                                        key={start.toISOString()}
                                        sx={{ml: 2}}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                sx={{
                                                    backgroundColor: isAfter(now, start) && isBefore(now, end) ? theme.palette.warning.main : undefined,
                                                    width: '1.5em',
                                                    height: '1.5em',
                                                }}
                                            >
                                                <Bookmark sx={{fontSize: '90%'}}/>
                                            </Avatar>
                                        </ListItemAvatar>

                                        <ListItemText
                                            secondary={<>Gebucht durch <strong>{user}</strong></>}
                                        >
                                            {format(start, 'HH:mm')} - {format(end, 'HH:mm')} Uhr
                                        </ListItemText>
                                    </ListItem>
                                ))
                            }
                        </List>
                    </CardContent>
                }
            </CardActionArea>
        </Card>
    );
}