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
    Typography
} from "@mui/material";
import {ChevronLeft, ChevronRight} from '@mui/icons-material';
import {months} from "../data/months";
import {addDays, addMonths, eachWeekOfInterval, format, isSameDay, startOfMonth, subMonths} from "date-fns";
import de from 'date-fns/locale/de';
import {weekdays, weekdaysShort} from "../data/weekdays";

interface CalendarProps {
    value: Date;
    onChange: (value: Date) => void;
    paperProps?: PaperProps;
}

export function Calendar(props: CalendarProps) {
    const today = new Date();
    const firstDayOfMonth = startOfMonth(props.value);
    const firstDayOfNextMonth = addMonths(firstDayOfMonth, 1);

    const weeksInMonth = eachWeekOfInterval(
        {
            start: firstDayOfMonth,
            end: firstDayOfNextMonth,
        },
        {
            locale: de,
            weekStartsOn: 1,
        }
    ).map(startOfWeek => weekdays.map((_, index) => addDays(startOfWeek, index)));


    const handleNextMonth = () => {
        props.onChange(addMonths(props.value, 1));
    };
    const handlePreviousMonth = () => {
        props.onChange(subMonths(props.value, 1));
    };

    return (
        <Paper
            {...props.paperProps}
            sx={{p: 1, ...props.paperProps?.sx}}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <IconButton onClick={handlePreviousMonth}>
                    <ChevronLeft/>
                </IconButton>

                <Typography>
                    {months[props.value.getMonth()]}
                    &nbsp;
                    {props.value.getFullYear()}
                </Typography>

                <IconButton onClick={handleNextMonth}>
                    <ChevronRight/>
                </IconButton>
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
                        {
                            weeksInMonth.map((dates, index) => (
                                <TableRow key={index}>
                                    {
                                        dates.map(day => (
                                            <TableCell
                                                key={day.toISOString()}
                                                sx={{
                                                    opacity: day.getMonth() === props.value.getMonth() ? undefined : 0.5,
                                                }}
                                                align="center"
                                                padding="normal"
                                            >
                                                <Button
                                                    onClick={() => props.onChange(day)}
                                                    variant={isSameDay(props.value, day) ? 'outlined' : undefined}
                                                    size="small"
                                                    color={isSameDay(today, day) ? 'error' : undefined}
                                                >
                                                    {format(day, 'dd.')}
                                                </Button>
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