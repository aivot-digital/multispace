import {Box, Button, Typography, useTheme} from "@mui/material";
import {useParams} from "react-router-dom";
import {useEffect, useMemo, useReducer, useState} from "react";
import {Room} from "../models/room";
import {FloorApiService, RoomBookingsApiService, RoomsApiService} from "../services/rest-api-service";
import {Floor} from "../models/floor";
import {RoomBookingWithUser} from "../models/room-booking";
import {useAppDispatch, useAppSelector} from "../hooks";
import {addMessage, selectCurrentDate, setCurrentDate} from "../features/app";
import {endOfWeek, format, formatISO, parseISO, startOfWeek} from "date-fns";
import {DayPlan} from "../components/day-plan";
import {BookmarkAddOutlined} from "@mui/icons-material";
import {BookRoomDialog} from "../dialogs/book-room-dialog";
import {ConfirmDialog} from "../dialogs/confirm-dialog";


export function RoomPage() {
    const theme = useTheme();

    const {id} = useParams();
    const dispatch = useAppDispatch();

    const currentDate = useAppSelector(selectCurrentDate);
    const firstDayInWeek = useMemo(() => startOfWeek(currentDate, {weekStartsOn: 1}), [currentDate]);
    const lastDayInWeek = useMemo(() => endOfWeek(currentDate, {weekStartsOn: 1}), [currentDate]);

    const userId = useAppSelector(state => state.user.userId);
    const user = useAppSelector(state => state.user.user);

    const [showBookingDialog, toggleBookingDialog] = useReducer(p => !p, false);

    const [room, setRoom] = useState<Room>();
    const [floor, setFloor] = useState<Floor>();
    const [bookings, setBookings] = useState<RoomBookingWithUser[]>();
    const [bookingToDelete, setBookingToDelete] = useState<RoomBookingWithUser>();

    useEffect(() => {
        if (id != null) {
            RoomsApiService
                .retrieve(id)
                .then(setRoom);
        }
    }, [id]);

    useEffect(() => {
        if (room != null) {
            FloorApiService
                .retrieve(room.floor)
                .then(setFloor);

            RoomBookingsApiService
                .listWithUsers({
                    room: room.id,
                    start__gte: firstDayInWeek.toISOString(),
                    start__lte: lastDayInWeek.toISOString(),
                })
                .then(setBookings);
        }
    }, [room, firstDayInWeek, lastDayInWeek]);

    if (room == null || floor == null || bookings == null || userId == null) {
        return null;
    }

    const handleAddBooking = (start: Date, end: Date) => {
        RoomBookingsApiService.create({
            id: 0,
            room: room.id,
            user: userId,
            start: formatISO(start),
            end: formatISO(end),
        })
            .then(res => setBookings([...bookings, {...res, user: user!}]))
            .catch(err => {
                console.error(err);
                dispatch(addMessage({
                    id: 'booking_failed',
                    title: 'Raumbuchung konnte nicht angelegt werden',
                    message: 'Die Raumbuchung konnte nicht angelegt werden. Der Raum ist im angegebenen Zeitraum bereits gebucht.',
                    severity: 'error',
                }));
            });
        toggleBookingDialog();
    };

    const handleDeleteBooking = () => {
        if (bookingToDelete != null) {
            RoomBookingsApiService.destroy(bookingToDelete.id);
            setBookings(bookings.filter(bk => bk.id !== bookingToDelete.id));
            setBookingToDelete(undefined);
        }
    };

    return (
        <>
            <Box>
                <Box
                    sx={{
                        display: 'flex',
                        mb: 2,
                        flexDirection: 'column',
                        [theme.breakpoints.up('md')]: {
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        },
                    }}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            component="h1"
                        >
                            {room.name}
                        </Typography>

                        <Typography
                            variant="subtitle1"
                            component="h2"
                        >
                            @ {floor.name}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            mt: 2,
                            [theme.breakpoints.up('md')]: {
                                mt: 0,
                            },
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<BookmarkAddOutlined/>}
                            onClick={toggleBookingDialog}
                        >
                            Buchen
                        </Button>
                    </Box>
                </Box>

                {
                    room.description != null &&
                    room.description.trim().length > 0 &&
                    <Box sx={{mt: 1}}>
                        <Typography variant="body2">
                            {room.description}
                        </Typography>
                    </Box>
                }

                <DayPlan
                    value={currentDate}
                    onChange={day => dispatch(setCurrentDate(day.toISOString()))}
                    markedPeriods={bookings.map(bk => ({
                        obj: bk,
                        start: parseISO(bk.start),
                        end: parseISO(bk.end),
                        label: bk.user.username,
                    }))}
                    onSelectMarkedPeriod={setBookingToDelete}
                    paperProps={{
                        sx: {
                            mt: 4
                        },
                    }}
                />
            </Box>

            {
                showBookingDialog &&
                <BookRoomDialog
                    room={room}
                    onClose={toggleBookingDialog}
                    onBook={handleAddBooking}
                />
            }

            <ConfirmDialog
                title="Buchung löschen"
                onClose={() => setBookingToDelete(undefined)}
                onPositive={handleDeleteBooking}
                open={bookingToDelete != null && bookingToDelete.user.id === userId}
            >
                Soll die Buchung
                am <strong>{bookingToDelete != null ? format(parseISO(bookingToDelete.start), 'dd.MM.yyyy') : ''}</strong> von <strong>{bookingToDelete != null ? format(parseISO(bookingToDelete.start), 'HH:mm') : ''} Uhr</strong>bis <strong>{bookingToDelete != null ? format(parseISO(bookingToDelete.end), 'HH:mm') : ''} Uhr</strong> wirklich
                gelöscht werden?
            </ConfirmDialog>
        </>
    );
}
