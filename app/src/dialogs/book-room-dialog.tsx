import {Room} from "../models/room";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import React from "react";
import * as yup from "yup";
import {DateTimePicker, TimePicker} from "@mui/x-date-pickers";
import {useFormik} from "formik";
import {addHours, differenceInMinutes, format, isBefore} from "date-fns";
import {useAppSelector} from "../hooks";
import {selectCurrentDate} from "../features/app";


const validationSchema = yup.object({
    start: yup
        .date()
        .defined()
        .required('Der Startzeitpunkt ist eine Pflichtangabe'),
    end: yup
        .date()
        .defined()
        .required('Der Endzeitpunkt ist eine Pflichtangabe'),
});


interface BookRoomDialogProps {
    room: Room;
    onClose: () => void;
    onBook: (start: Date, end: Date) => void;
}

export function BookRoomDialog(props: BookRoomDialogProps) {
    const currentDate = useAppSelector(selectCurrentDate);

    const formik = useFormik({
        initialValues: {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 8, 0, 0, 0),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 9, 0, 0, 0),
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (isBefore(values.end, values.start)) {
                formik.setFieldError('end', 'Das Ende darf nicht vor dem Beginn liegen')
            } else if (differenceInMinutes(values.end, values.start) < 15) {
                formik.setFieldError('end', 'Räume können nicht für weniger als 15 Minuten gebucht werden')
            } else {
                props.onBook(values.start, values.end);
            }
        },
    });

    const handleClose = () => {
        formik.resetForm();
        props.onClose();
    };

    return (
        <Dialog
            open={true}
            onClose={handleClose}
        >
            <DialogTitle>
                {props.room.name} für den {format(currentDate, 'dd.MM.yyyy')} buchen
            </DialogTitle>

            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <TimePicker
                        label="Start"
                        value={formik.values.start}
                        onChange={value => {
                            formik.setFieldValue('start', value);
                        }}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                margin: 'normal',
                                id: 'start',
                                name: 'start',
                                error: formik.touched.start && Boolean(formik.errors.start),
                                helperText: (formik.touched.start && formik.errors.start != null) ? String(formik.errors.start) : undefined,
                                required: true,
                            },
                        }}
                    />
                    <TimePicker
                        label="Ende"
                        value={formik.values.end}
                        onChange={value => {
                            formik.setFieldValue('end', value);
                        }}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                margin: 'normal',
                                id: 'start',
                                name: 'start',
                                error: formik.touched.end && Boolean(formik.errors.end),
                                helperText: (formik.touched.end && formik.errors.end != null) ? String(formik.errors.end) : undefined,
                                required: true,
                            },
                        }}
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        type="submit"
                        autoFocus
                    >
                        Buchen
                    </Button>
                    <Button
                        type="button"
                        onClick={handleClose}
                        autoFocus
                    >
                        Abbrechen
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}