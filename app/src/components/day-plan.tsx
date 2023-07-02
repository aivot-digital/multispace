import {
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
import {addDays, addWeeks, endOfWeek, format, isSameDay, startOfWeek, subDays, subWeeks,} from "date-fns";
import de from 'date-fns/locale/de';
import {weekdays, weekdaysShort} from "../data/weekdays";
import {useAppDispatch, useAppSelector} from "../hooks";
import {toggleCalendarMinimized} from "../features/app";

interface DayPlanProps<T extends { id: number }> {
    value: Date;
    onChange: (value: Date) => void;
    paperProps?: PaperProps;
    markedPeriods?: { start: Date, end: Date, label: string, obj: T }[];
    onSelectMarkedPeriod?: (obj: T) => void;
}

const businessHours: {
    label: string;
    hour: number,
    minutes: number[],
}[] = Array(18)
    .fill(0)
    .map((_, index) => ({
        label: `${(5 + index).toString().padStart(2, '0')}:00`,
        hour: 5 + index,
        minutes: [0, 15, 30, 45],
    }));


const colors = [
    '#22A699',
    '#F2BE22',
    '#F24C3D',
    '#4F709C',
    '#DD58D6',
    '#321E1E',
];

function getColor(index: number) {
    return colors[index % colors.length];
}

export function DayPlan<T extends { id: number }>(props: DayPlanProps<T>) {
    const theme = useTheme();

    const today = new Date();
    const dispatch = useAppDispatch();
    const isMinimized = useAppSelector(state => state.app.calendarMinimized);

    const firstDayInWeek = startOfWeek(props.value, {
        locale: de,
        weekStartsOn: 1,
    });
    const laysDayInWeek = endOfWeek(props.value, {
        locale: de,
        weekStartsOn: 1,
    });

    const daysInWeek = isMinimized ? [props.value] : weekdays.map((_, index) => addDays(firstDayInWeek, index));

    const toggleIsMinimized = () => {
        dispatch(toggleCalendarMinimized());
    };

    const handleNext = () => {
        if (isMinimized) {
            props.onChange(addDays(props.value, 1));
        } else {
            props.onChange(addWeeks(props.value, 1));
        }
    };
    const handlePrevious = () => {
        if (isMinimized) {
            props.onChange(subDays(props.value, 1));
        } else {
            props.onChange(subWeeks(props.value, 1));
        }
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
                    <IconButton onClick={handlePrevious}>
                        <ChevronLeft/>
                    </IconButton>
                </Tooltip>

                {
                    isMinimized &&
                    <Typography
                        sx={{
                            fontSize: '90%',
                            [theme.breakpoints.up('sm')]: {
                                fontSize: 'inherit',
                            },
                        }}
                    >
                        {format(props.value, 'dd.MM.yyyy')}
                    </Typography>
                }

                {
                    !isMinimized &&
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
                }

                <Tooltip title="Nächster Monat">
                    <IconButton onClick={handleNext}>
                        <ChevronRight/>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Zu Heute springen">
                    <IconButton
                        sx={{ml: 'auto'}}
                        onClick={() => props.onChange(new Date())}
                    >
                        <Today/>
                    </IconButton>
                </Tooltip>

                <Tooltip title={isMinimized ? 'Vergrößern' : 'Minimieren'}>
                    <IconButton
                        onClick={toggleIsMinimized}
                    >
                        {
                            isMinimized ? <OpenInFull/> : <CloseFullscreen/>
                        }
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
                    {
                        !isMinimized &&
                        <TableHead>
                            <TableRow>
                                <TableCell/>
                                {
                                    daysInWeek.map((day, index) => (
                                        <TableCell
                                            key={day.toISOString()}
                                        >
                                            <Button
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                sx={{
                                                    textDecoration: isSameDay(today, day) ? 'underline' : 'none',
                                                    textTransform: 'none',
                                                    borderColor: isSameDay(props.value, day) ? 'unset' : 'transparent',
                                                }}
                                                onClick={() => props.onChange(day)}
                                            >
                                                {weekdaysShort[index]} - {format(day, 'dd.MM.')}
                                            </Button>
                                        </TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                    }

                    <TableBody>
                        {
                            businessHours.map(bh => (
                                <TableRow key={bh.label}>
                                    <TableCell>
                                        {bh.label}
                                    </TableCell>
                                    {
                                        daysInWeek.map((day, index) => (
                                            <TableCell
                                                key={day.toISOString()}
                                                sx={{py: 0}}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'stretch',
                                                    }}
                                                >
                                                    {
                                                        bh.minutes.map(min => {
                                                            const date = new Date(
                                                                day.getFullYear(),
                                                                day.getMonth(),
                                                                day.getDate(),
                                                                bh.hour,
                                                                min,
                                                                0
                                                            );

                                                            const bookings =
                                                                (props.markedPeriods ?? [])
                                                                    .filter(({start, end}) => (
                                                                        (isSameDay(date, start) ||
                                                                            isSameDay(date, end)) &&
                                                                        (
                                                                            date.getHours() > start.getHours() || (
                                                                                date.getHours() === start.getHours() &&
                                                                                date.getMinutes() >= start.getMinutes()
                                                                            )
                                                                        ) && (
                                                                            date.getHours() < end.getHours() || (
                                                                                date.getHours() === end.getHours() &&
                                                                                date.getMinutes() < end.getMinutes()
                                                                            )
                                                                        )
                                                                    ));

                                                            return (
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        height: '1em',
                                                                    }}
                                                                >
                                                                    {
                                                                        bookings.map(({obj, label}, index) => (
                                                                            <Tooltip title={label}>
                                                                                <Box
                                                                                    key={min}
                                                                                    sx={{
                                                                                        backgroundColor: getColor(index),
                                                                                        height: '1em',
                                                                                        flex: 1,
                                                                                        cursor: 'pointer',
                                                                                        ':hover': {
                                                                                            opacity: 0.5,
                                                                                        }
                                                                                    }}
                                                                                    role='button'
                                                                                    onClick={() => props.onSelectMarkedPeriod && props.onSelectMarkedPeriod(obj)}
                                                                                />
                                                                            </Tooltip>
                                                                        ))
                                                                    }
                                                                </Box>
                                                            );
                                                        })
                                                    }
                                                </Box>
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
