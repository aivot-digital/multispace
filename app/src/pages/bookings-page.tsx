import {
    Box,
    Button,
    Paper,
    Skeleton,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs
} from "@mui/material";
import {useEffect, useState} from "react";
import {Floor} from "../models/floor";
import {
    DeskBookingsApiService,
    DesksApiService,
    FloorApiService,
    RoomBookingsApiService,
    RoomsApiService
} from "../services/rest-api-service";
import {useAppSelector} from "../hooks";
import {Desk} from "../models/desk";
import {Room} from "../models/room";
import {DeskBooking} from "../models/desk-booking";
import {RoomBooking} from "../models/room-booking";
import {format, parseISO} from 'date-fns';
import {Link} from "react-router-dom";
import {BookmarkRemoveOutlined} from "@mui/icons-material";
import de from "date-fns/locale/de";

export function BookingsPage() {
    const today = new Date();
    const userId = useAppSelector(state => state.user.userId);

    const [currentTab, setCurrentTab] = useState(0);

    const [floors, setFloors] = useState<Floor[]>();

    const [desks, setDesks] = useState<Desk[]>();
    const [rooms, setRooms] = useState<Room[]>();

    const [desksBookings, setDeskBookings] = useState<DeskBooking[]>();
    const [roomBookings, setRoomBookings] = useState<RoomBooking[]>();

    useEffect(() => {
        FloorApiService
            .list()
            .then(res => setFloors(res.results));

        DesksApiService
            .list()
            .then(res => setDesks(res.results));

        RoomsApiService
            .list()
            .then(res => setRooms(res.results));
    }, []);

    useEffect(() => {
        if (userId != null) {
            DeskBookingsApiService.list({
                user: userId.toString(),
                date__gte: today.toISOString(),
            }).then(res => setDeskBookings(res.results));

            RoomBookingsApiService.list({
                user: userId.toString(),
                start__gte: today.toISOString(),
            }).then(res => setRoomBookings(res.results));
        }
    }, [userId]);

    const handleRevokeDeskBooking = (booking: DeskBooking) => {
        DeskBookingsApiService.destroy(booking.id);
        setDeskBookings((desksBookings ?? []).filter(b => b !== booking));
    };

    const handleRvokeRoomBooking = (booking: RoomBooking) => {
        RoomBookingsApiService.destroy(booking.id);
        setRoomBookings((roomBookings ?? []).filter(b => b !== booking));
    };

    const hasLoaded =
        floors != null &&
        desks != null &&
        rooms != null &&
        desksBookings != null &&
        roomBookings != null;

    return (
        <Box>
            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                <Tabs
                    value={currentTab}
                    onChange={(_, value) => setCurrentTab(value)}
                >
                    <Tab
                        value={0}
                        label="Tischbuchungen"
                    />

                    <Tab
                        value={1}
                        label="Raumbuchungen"
                    />
                </Tabs>
            </Box>

            <Box
                sx={{
                    mt: 4,
                }}
            >
                {
                    currentTab === 0 &&
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Datum
                                    </TableCell>
                                    <TableCell>
                                        Bereich
                                    </TableCell>
                                    <TableCell>
                                        Tisch
                                    </TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    !hasLoaded &&
                                    <TableRow>
                                        <TableCell>
                                            <Skeleton variant="rectangular"/>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rectangular"/>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rectangular"/>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rectangular"/>
                                        </TableCell>
                                    </TableRow>
                                }

                                {
                                    hasLoaded &&
                                    desksBookings.length === 0 &&
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            Keine Tischbuchungen vorhanden
                                        </TableCell>
                                    </TableRow>
                                }

                                {
                                    hasLoaded &&
                                    desksBookings.map(db => {
                                        const desk = desks.find(d => d.id === db.desk);
                                        const floor = desk != null ? floors.find(f => f.id === desk.floor) : undefined;
                                        return (
                                            <TableRow key={db.id}>
                                                <TableCell>
                                                    {format(parseISO(db.date), 'dd.MM.yyyy', {locale: de})}
                                                </TableCell>
                                                <TableCell>
                                                    {floor?.name ?? ''}
                                                </TableCell>
                                                <TableCell>
                                                    <Link to={`/desks/${desk?.id}`}>{desk?.name ?? ''}</Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        color="error"
                                                        startIcon={<BookmarkRemoveOutlined/>}
                                                        onClick={() => handleRevokeDeskBooking(db)}
                                                    >
                                                        Stornieren
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                }

                {
                    currentTab === 1 &&
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Zeit
                                    </TableCell>
                                    <TableCell>
                                        Bereich
                                    </TableCell>
                                    <TableCell>
                                        Raum
                                    </TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    !hasLoaded &&
                                    <TableRow>
                                        <TableCell>
                                            <Skeleton variant="rectangular"/>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rectangular"/>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rectangular"/>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rectangular"/>
                                        </TableCell>
                                    </TableRow>
                                }

                                {
                                    hasLoaded &&
                                    roomBookings.length === 0 &&
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            Keine Raumbuchungen vorhanden
                                        </TableCell>
                                    </TableRow>
                                }

                                {
                                    hasLoaded &&
                                    roomBookings.map(rb => {
                                        const room = rooms.find(d => d.id === rb.room);
                                        const floor = room != null ? floors.find(f => f.id === room.floor) : undefined;
                                        return (
                                            <TableRow key={rb.id}>
                                                <TableCell>
                                                    {format(parseISO(rb.start), 'dd.MM.yyyy HH:mm', {locale: de})}
                                                    <br/>bis<br/>
                                                    {format(parseISO(rb.end), 'dd.MM.yyyy HH:mm', {locale: de})}
                                                </TableCell>
                                                <TableCell>
                                                    {floor?.name ?? ''}
                                                </TableCell>
                                                <TableCell>
                                                    <Link to={`/rooms/${room?.id}`}>{room?.name ?? ''}</Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        color="error"
                                                        startIcon={<BookmarkRemoveOutlined/>}
                                                        onClick={() => handleRvokeRoomBooking(rb)}
                                                    >
                                                        Stornieren
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            </Box>
        </Box>
    );
}