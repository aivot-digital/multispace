import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField} from "@mui/material";
import {FormikConfig, FormikValues, useFormik} from "formik";
import {User} from "../models/user";
import * as yup from "yup";

const validationSchemaExistingUser = yup.object({
    username: yup
        .string()
        .defined()
        .required('Der Benutzername ist eine Pflichtangabe')
        .trim()
        .min(6, 'Der Benutzername muss mindestens 6 Zeichen haben')
        .max(12, 'Der Benutzername darf maximal 12 Zeichen haben')
        .matches(/^[a-zA-Z0-9]+$/ , 'Der Benutzername darf nur aus Zahlen, Klein- und Großbuchstaben bestehen'),
    password: yup
        .string()
        .min(8, 'Das Passwort muss mindestens 8 Zeichen haben')
        .max(72, 'Das Passwort darf maximal 72 Zeichen haben'),
    passwordRetyped: yup
        .string()
        .oneOf([yup.ref('password')], 'Die eingegebenen Passwörter stimmen nicht überein')
});

const validationSchemaNewUser = yup.object({
    username: yup
        .string()
        .defined()
        .required('Der Benutzername ist eine Pflichtangabe')
        .min(6, 'Der Benutzername muss mindestens 6 Zeichen haben')
        .max(12, 'Der Benutzername darf maximal 12 Zeichen haben')
        .matches(/^[a-zA-Z0-9]+$/ , 'Der Benutzername darf nur aus Zahlen, Klein- und Großbuchstaben bestehen'),
    password: yup
        .string()
        .required('Das Passwort ist eine Pflichtangabe')
        .min(8, 'Das Passwort muss mindestens 8 Zeichen haben')
        .max(72, 'Das Passwort darf maximal 72 Zeichen haben'),
    passwordRetyped: yup
        .string()
        .required('Bitte wiederholen Sie das Passwort')
        .oneOf([yup.ref('password')], 'Die eingegebenen Passwörter stimmen nicht überein'),
});

interface EditUserDialogProps {
    user: User;
    onSave: (user: User) => void;
    onCancel: () => void;
}

export function EditUserDialog(props: EditUserDialogProps) {
    const formik = useFormik({
        initialValues: {
            username: props.user.username,
            password: '',
            passwordRetyped: '',
        },
        validationSchema: props.user.id === 0 ? validationSchemaNewUser : validationSchemaExistingUser,
        onSubmit: (values) => {
            props.onSave({
                ...props.user,
                username: values.username,
                password: values.password,
            });
        },
    });

    return (
        <Dialog
            open={true}
            onClose={props.onCancel}
            fullWidth
        >
            <DialogTitle>
                Nutzer bearbeiten
            </DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Benutzername"

                        id="username"
                        name="username"

                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                    />

                    <Divider sx={{my: 4}}>
                        Passwort setzen
                    </Divider>

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Neues Passwort"
                        type="password"

                        id="password"
                        name="password"

                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Neues Passwort wiederholen"
                        type="password"

                        id="passwordRetyped"
                        name="passwordRetyped"

                        value={formik.values.passwordRetyped}
                        onChange={formik.handleChange}
                        error={formik.touched.passwordRetyped && Boolean(formik.errors.passwordRetyped)}
                        helperText={formik.touched.passwordRetyped && formik.errors.passwordRetyped}
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
                        onClick={props.onCancel}
                        autoFocus
                    >
                        Abbrechen
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
