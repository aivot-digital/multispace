import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React from "react";
import {Desk} from "../models/desk";
import * as yup from "yup";
import {FormikConfig, useFormik} from "formik";

const validationSchema = yup.object({
    name: yup
        .string()
        .defined()
        .required('Der Name ist eine Pflichtangabe')
        .min(3, 'Der Name des Tischs muss aus mindestens 3 Zeichen bestehen')
        .min(32, 'Der Name des Tischs darf aus maximal 32 Zeichen bestehen'),
    description: yup
        .string()
        .defined(),
});

interface EditDeskDialogProps {
    desk: Desk;

    onSave: (desk: Desk) => void;
    onDelete: (desk: Desk) => void;
    onClose: () => void;
}

export function EditDeskDialog(props: EditDeskDialogProps) {
    const formik = useFormik({
        initialValues: {
            name: props.desk?.name ?? '',
            description: props.desk?.description ?? '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            props.onSave({
                ...props.desk,
                name: values.name,
                description: values.description,
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
                Tisch bearbeiten
            </DialogTitle>

            <form onSubmit={formik.handleSubmit}>
                <DialogContent>

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Name des Tisches"

                        id="name"
                        name="name"

                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Beschreibung des Tisches"

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
                        onClick={() => props.onDelete(props.desk)}
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