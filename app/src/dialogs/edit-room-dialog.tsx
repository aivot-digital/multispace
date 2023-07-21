import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React from "react";
import * as yup from "yup";
import {useFormik} from "formik";
import {Room} from "../models/room";

const validationSchema = yup.object({
    name: yup
        .string()
        .defined()
        .required('Dies ist eine Pflichtangabe. Bitte füllen Sie das Feld entsprechend aus.')
        .min(3, 'Der Name des Raums muss aus mindestens 3 Zeichen bestehen.')
        .max(32, 'Der Name des Raums darf aus maximal 32 Zeichen bestehen.'),
    description: yup
        .string(),
});

interface EditRoomDialogProps {
    room: Room;

    onSave: (room: Room) => void;
    onDelete: (room: Room) => void;
    onClose: () => void;
}

export function EditRoomDialog(props: EditRoomDialogProps) {
    const formik = useFormik({
        initialValues: {
            name: props.room?.name ?? '',
            description: props.room?.description ?? '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            props.onSave({
                ...props.room,
                name: values.name,
                description: values.description ?? '',
            });
        },
    });

    return (
        <Dialog
            open={true}
            onClose={props.onClose}
            fullWidth
        >
            <DialogTitle>
                Raum bearbeiten
            </DialogTitle>

            <form onSubmit={formik.handleSubmit}>
                <DialogContent>

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Name des Raums"

                        id="name"
                        name="name"

                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}

                        required
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Beschreibung des Raums"

                        id="description"
                        name="description"

                        multiline
                        rows={5}

                        value={formik.values.description}
                        onChange={formik.handleChange}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        type="button"
                        onClick={() => props.onDelete(props.room)}
                        color="error"
                        sx={{mr: 'auto'}}
                    >
                        Löschen
                    </Button>

                    <Button
                        type="submit"
                    >
                        Speichern
                    </Button>

                    <Button
                        type="button"
                        onClick={props.onClose}
                        autoFocus
                    >
                        Abbrechen
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
