import {Alert, AlertTitle, Box, Button, Typography, useTheme} from "@mui/material";
import {useParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {Desk} from "../models/desk";
import {DeskBookingsApiService, DesksApiService, FloorApiService} from "../services/rest-api-service";
import {Floor} from "../models/floor";
import {DeskBookingWithUser} from "../models/desk-booking";
import {BookmarkAddOutlined, BookmarkRemoveOutlined} from "@mui/icons-material";
import {Calendar} from "../components/calendar";
import {useAppDispatch, useAppSelector} from "../hooks";
import {selectCurrentDate, setCurrentDate} from "../features/app";
import {endOfMonth, format, isSameDay, parseISO, startOfMonth} from "date-fns";


export function DeskPage() {
    const theme = useTheme();

    const {id} = useParams();
    const dispatch = useAppDispatch();

    const currentDate = useAppSelector(selectCurrentDate);

    const firstDayInMonth = useMemo(() => startOfMonth(currentDate), [currentDate]);
    const lastDayInMonth = useMemo(() => endOfMonth(currentDate), [currentDate]);

    const userId = useAppSelector(state => state.user.userId);
    const user = useAppSelector(state => state.user.user);

    const [desk, setDesk] = useState<Desk>();
    const [floor, setFloor] = useState<Floor>();
    const [bookings, setBookings] = useState<DeskBookingWithUser[]>();

    useEffect(() => {
        if (id != null) {
            DesksApiService
                .retrieve(id)
                .then(setDesk);
        }
    }, [id]);

    useEffect(() => {
        if (desk != null) {
            FloorApiService
                .retrieve(desk.floor)
                .then(setFloor);

            DeskBookingsApiService
                .listWithUsers({
                    desk: desk.id,
                    date__gte: firstDayInMonth.toISOString(),
                    date__lte: lastDayInMonth.toISOString(),
                })
                .then(setBookings);

        }
    }, [desk, firstDayInMonth, lastDayInMonth]);

    if (desk == null || floor == null || bookings == null || userId == null) {
        return null;
    }

    const bookingForToday = bookings.find(b => isSameDay(parseISO(b.date), currentDate));

    const handleAddBooking = () => {
        DeskBookingsApiService.create({
            id: 0,
            desk: desk.id,
            user: userId,
            date: format(currentDate, 'yyyy-MM-dd'),
        })
            .then(res => setBookings([...bookings, {
                ...res,
                user: user!,
            }]));
    };

    const handleRevokeBooking = () => {
        if (bookingForToday != null) {
            DeskBookingsApiService.destroy(bookingForToday.id);
            setBookings(bookings.filter(b => b !== bookingForToday));
        }
    };


    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
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
                        {desk.name}
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
                    {
                        bookingForToday == null &&
                        <Button
                            variant="contained"
                            startIcon={<BookmarkAddOutlined/>}
                            onClick={handleAddBooking}
                        >
                            Buchen
                        </Button>
                    }
                    {
                        bookingForToday != null &&
                        bookingForToday.user.id === userId &&
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<BookmarkRemoveOutlined/>}
                            onClick={handleRevokeBooking}
                        >
                            Buchung stornieren
                        </Button>
                    }
                </Box>
            </Box>

            {
                desk.description != null &&
                desk.description.trim().length > 0 &&
                <Box sx={{mt: 1}}>
                    <Typography variant="body2">
                        {desk.description}
                    </Typography>
                </Box>
            }

            <Box sx={{mt: 4}}>
                {
                    bookingForToday != null &&
                    bookingForToday.user.id !== userId &&
                    <Alert severity="error">
                        <AlertTitle>Tisch bereits gebucht</AlertTitle>
                        Dieser Tisch ist am <strong>{format(currentDate, 'dd.MM.yyyy')}</strong> bereits
                        von <strong>{bookingForToday.user.username}</strong> gebucht. Buche dieses Tisch einfach an
                        einem anderen Tag.
                    </Alert>
                }

                {
                    bookingForToday != null &&
                    bookingForToday.user.id === userId &&
                    <Alert severity="info">
                        <AlertTitle>Tisch bereits gebucht</AlertTitle>
                        Dieser Tisch ist am <strong>{format(currentDate, 'dd.MM.yyyy')}</strong> bereits durch Sie
                        gebucht. Sie können die Buchung jederzeit stornieren.
                    </Alert>
                }

                {
                    bookingForToday == null &&
                    <Alert severity="success">
                        <AlertTitle>Tisch frei</AlertTitle>
                        Dieser Tisch ist am <strong>{format(currentDate, 'dd.MM.yyyy')}</strong> noch frei.
                        Buchen Sie diesen Tisch jetzt um am {format(currentDate, 'dd.MM.yyyy')} daran zu arbeiten.
                    </Alert>
                }
            </Box>

            <Calendar
                value={currentDate}
                onChange={date => dispatch(setCurrentDate(date.toISOString()))}
                paperProps={{
                    sx: {
                        mt: 4
                    },
                }}
                markedDates={bookings.map(b => parseISO(b.date))}
            />
        </Box>
    );
}
