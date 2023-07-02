import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {useFormik} from "formik";
import * as yup from "yup";
import React from "react";


const validationSchema = yup.object({
    title: yup
        .string()
        .defined()
        .required('Der Titel ist eine Pflichtangabe')
        .min(6, 'Der Titel muss aus mindestens 6 Zeichen bestehen')
        .max(191, 'Der Titel darf aus maximal 191 Zeichen bestehen'),
});

interface AddDisplayKeyDialogProps {
    onAdd: (title: string) => void;
    onClose: () => void;
}

export function AddDisplayKeyDialog(props: AddDisplayKeyDialogProps) {
    const formik = useFormik({
        initialValues: {
            title: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            props.onAdd(values.title);
        },
    });

    return (
        <Dialog
            open={true}
            onClose={props.onClose}
            fullWidth
        >
            <DialogTitle>
                Anzeige hinzufügen
            </DialogTitle>

            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Titel der Anzeige"

                        id="title"
                        name="title"

                        value={formik.values.title}
                        onChange={formik.handleChange}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                    />
                </DialogContent>

                <DialogActions>
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