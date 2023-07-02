import {
    Badge,
    Box,
    Button,
    IconButton,
    Paper,
    PaperProps,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import {ChevronLeft, ChevronRight, CloseFullscreen, OpenInFull, Today} from '@mui/icons-material';
import {months} from "../data/months";
import {
    addDays,
    addMonths,
    addWeeks,
    eachWeekOfInterval,
    endOfWeek,
    format,
    isSameDay,
    startOfMonth,
    startOfWeek,
    subMonths, subWeeks,
} from "date-fns";
import de from 'date-fns/locale/de';
import {weekdays, weekdaysShort} from "../data/weekdays";
import {useAppDispatch, useAppSelector} from "../hooks";
import {toggleCalendarMinimized} from "../features/app";

interface CalendarProps {
    value: Date;
    onChange: (value: Date) => void;
    paperProps?: PaperProps;
    markedDates?: Date[];
}

export function Calendar(props: CalendarProps) {
    const today = new Date();
    const dispatch = useAppDispatch();
    const isMinimized = useAppSelector(state => state.app.calendarMinimized);

    const toggleIsMinimized = () => {
        dispatch(toggleCalendarMinimized());
    };

    if (isMinimized) {
        return (
            <WeekCalendar
                today={today}
                onToggleState={toggleIsMinimized}
                {...props}
            />
        );
    } else {
        return (
            <MonthCalendar
                today={today}
                onToggleState={toggleIsMinimized}
                {...props}
            />
        );
    }
}

function WeekCalendar(props: { today: Date, onToggleState: () => void, } & CalendarProps) {
    const theme = useTheme();

    const firstDayInWeek = startOfWeek(props.value, {
        locale: de,
        weekStartsOn: 1,
    });
    const laysDayInWeek = endOfWeek(props.value, {
        locale: de,
        weekStartsOn: 1,
    });

    const daysInWeek = weekdays.map((_, index) => {
        const day = addDays(firstDayInWeek, index);
        day.setHours(12);
        return {
            day: day,
            marked: props.markedDates != null && props.markedDates.some(d => isSameDay(day, d)),
        }
    });

    const handleNextWeek = () => {
        props.onChange(addWeeks(props.value, 1));
    };
    const handlePreviousWeek = () => {
        props.onChange(subWeeks(props.value, 1));
    };

    return (
        <Paper
            {...props.paperProps}
            sx={{
                ...props.paperProps?.sx,
                p: 1,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Tooltip title="Vorherigee Woche">
                    <IconButton onClick={handlePreviousWeek}>
                        <ChevronLeft/>
                    </IconButton>
                </Tooltip>

                <Typography
                    sx={{
                        fontSize: '80%',
                        [theme.breakpoints.up('sm')]: {
                            fontSize: 'inherit',
                        },
                    }}
                >
                    {months[props.value.getMonth()]}
                    &nbsp;
                    {props.value.getFullYear()}
                    &ensp;
                    ({format(firstDayInWeek, 'dd.')}&nbsp;-&nbsp;{format(laysDayInWeek, 'dd.')})
                </Typography>

                <Tooltip title="Nächste Woche">
                    <IconButton onClick={handleNextWeek}>
                        <ChevronRight/>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Zu Heute springen">
                    <IconButton
                        sx={{ml: 'auto'}}
                        onClick={() => {
                            const today = new Date();
                            today.setHours(12);
                            props.onChange(today);
                        }}
                    >
                        <Today/>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Vergrößern">
                    <IconButton
                        onClick={props.onToggleState}
                    >
                        <OpenInFull/>
                    </IconButton>
                </Tooltip>
            </Box>

            <TableContainer>
                <Table
                    size="small"
                    sx={{
                        '& tbody tr:last-child td': {
                            borderBottom: "none",
                        },
                    }}
                >
                    <TableHead>
                        <TableRow>
                            {
                                weekdaysShort.map(label => (
                                    <TableCell
                                        key={label}
                                        align="center"
                                    >
                                        {label}
                                    </TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            {
                                daysInWeek.map(({day, marked}) => (
                                    <TableCell
                                        key={day.toISOString()}
                                        sx={{
                                            opacity: day.getMonth() === props.value.getMonth() ? undefined : 0.5,
                                        }}
                                        align="center"
                                        padding="normal"
                                    >
                                        {
                                            marked ? (
                                                <Badge
                                                    color="error"
                                                    variant="dot"
                                                >
                                                    <Button
                                                        onClick={() => props.onChange(day)}
                                                        variant={isSameDay(props.value, day) ? 'contained' : (isSameDay(props.today, day) ? 'outlined' : undefined)}
                                                        size="small"
                                                        color={marked ? 'error' : undefined}
                                                        sx={{
                                                            textDecoration: isSameDay(props.today, day) ? 'underline' : undefined,
                                                        }}
                                                    >
                                                        {format(day, 'dd.')}
                                                    </Button>
                                                </Badge>
                                            ) : (
                                                <Button
                                                    onClick={() => props.onChange(day)}
                                                    variant={isSameDay(props.value, day) ? 'contained' : (isSameDay(props.today, day) ? 'outlined' : undefined)}
                                                    size="small"

                                                    sx={{
                                                        textDecoration: isSameDay(props.today, day) ? 'underline' : undefined,
                                                    }}
                                                >
                                                    {format(day, 'dd.')}
                                                </Button>
                                            )
                                        }
                                    </TableCell>
                                ))
                            }
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

function MonthCalendar(props: { today: Date, onToggleState: () => void, } & CalendarProps) {
    const theme = useTheme();

    const firstDayOfCalendar = startOfMonth(props.value);
    const firstDayOfNextCalendar = addMonths(firstDayOfCalendar, 1);

    const daysInMonth = eachWeekOfInterval(
        {
            start: firstDayOfCalendar,
            end: firstDayOfNextCalendar,
        },
        {
            locale: de,
            weekStartsOn: 1,
        }
    ).map(firstDayOfWeek => weekdays.map((_, index) => {
        const day = addDays(firstDayOfWeek, index);
        day.setHours(12);
        return {
            day: day,
            marked: props.markedDates != null && props.markedDates.some(d => isSameDay(day, d)),
        }
    }));

    const handleNextMonth = () => {
        props.onChange(addMonths(props.value, 1));
    };
    const handlePreviousMonth = () => {
        props.onChange(subMonths(props.value, 1));
    };

    return (
        <Paper
            {...props.paperProps}
            sx={{
                ...props.paperProps?.sx,
                p: 1,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Tooltip title="Vorheriger Monat">
                    <IconButton onClick={handlePreviousMonth}>
                        <ChevronLeft/>
                    </IconButton>
                </Tooltip>

                <Typography
                    sx={{
                        fontSize: '90%',
                        [theme.breakpoints.up('sm')]: {
                            fontSize: 'inherit',
                        },
                    }}
                >
                    {months[props.value.getMonth()]}
                    &nbsp;
                    {props.value.getFullYear()}
                </Typography>

                <Tooltip title="Nächster Monat">
                    <IconButton onClick={handleNextMonth}>
                        <ChevronRight/>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Zu Heute springen">
                    <IconButton
                        sx={{ml: 'auto'}}
                        onClick={() => {
                            const today = new Date();
                            today.setHours(12);
                            props.onChange(today);
                        }}
                    >
                        <Today/>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Minimieren">
                    <IconButton
                        onClick={props.onToggleState}
                    >
                        <CloseFullscreen/>
                    </IconButton>
                </Tooltip>
            </Box>

            <TableContainer>
                <Table
                    size="small"
                    sx={{
                        '& tbody tr:last-child td': {
                            borderBottom: "none",
                        },
                        overflowX: 'scroll',
                    }}
                >
                    <TableHead>
                        <TableRow>
                            {
                                weekdaysShort.map(label => (
                                    <TableCell
                                        key={label}
                                        align="center"
                                    >
                                        {label}
                                    </TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            daysInMonth.map((dates, index) => (
                                <TableRow key={index}>
                                    {
                                        dates.map(({day, marked}) => (
                                            <TableCell
                                                key={day.toISOString()}
                                                sx={{
                                                    opacity: day.getMonth() === props.value.getMonth() ? undefined : 0.5,
                                                }}
                                                align="center"
                                                padding="normal"
                                            >
                                                {
                                                    marked ? (
                                                        <Badge
                                                            color="error"
                                                            variant="dot"
                                                        >
                                                            <Button
                                                                onClick={() => props.onChange(day)}
                                                                variant={isSameDay(props.value, day) ? 'contained' : (isSameDay(props.today, day) ? 'outlined' : undefined)}
                                                                size="small"
                                                                color={marked ? 'error' : undefined}
                                                                sx={{
                                                                    textDecoration: isSameDay(props.today, day) ? 'underline' : undefined,
                                                                }}
                                                            >
                                                                {format(day, 'dd.')}
                                                            </Button>
                                                        </Badge>
                                                    ) : (
                                                        <Button
                                                            onClick={() => props.onChange(day)}
                                                            variant={isSameDay(props.value, day) ? 'contained' : (isSameDay(props.today, day) ? 'outlined' : undefined)}
                                                            size="small"

                                                            sx={{
                                                                textDecoration: isSameDay(props.today, day) ? 'underline' : undefined,
                                                            }}
                                                        >
                                                            {format(day, 'dd.')}
                                                        </Button>
                                                    )
                                                }
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}