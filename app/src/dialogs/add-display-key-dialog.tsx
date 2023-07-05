import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Switch,
    TextField, Typography
} from "@mui/material";
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
    anonymous: yup
        .boolean()
        .defined(),
    listView: yup
        .boolean()
        .defined(),
});

interface AddDisplayKeyDialogProps {
    onAdd: (title: string, anonymous: boolean, listView: boolean) => void;
    onClose: () => void;
}

export function AddDisplayKeyDialog(props: AddDisplayKeyDialogProps) {
    const formik = useFormik({
        initialValues: {
            title: '',
            anonymous: true,
            listView: false,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            props.onAdd(values.title, values.anonymous, values.listView);
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

                        required
                    />

                    <Box sx={{mt: 2}}>
                        <FormControlLabel
                            control={
                                <Switch
                                    id="anonymous"
                                    name="anonymous"
                                    checked={formik.values.anonymous}
                                    onChange={formik.handleChange}
                                />
                            }
                            label="Benutzernamen ausblenden"
                        />

                        <Typography variant="body2">
                            Wenn die Benutzernamen ausgeblendet werden, wird in der Anzeige nur dargestellt, dass ein
                            Tisch oder Raum zum Zeitpunkt des Aufrufs gebucht ist oder nicht.
                            Wenn Sie diese Option deaktivieren, wird in der Anzeige auch der Name, der buchenden
                            Mitarbeiter:in angezeigt.
                        </Typography>
                    </Box>

                    <Box sx={{mt: 2}}>
                        <FormControlLabel
                            control={
                                <Switch
                                    id="listView"
                                    name="listView"
                                    checked={formik.values.listView}
                                    onChange={formik.handleChange}
                                />
                            }
                            label="Als Liste anzeigen"
                        />
                        <Typography variant="body2">
                            Wenn Sie diese Option aktivieren, wird die Anzeige nicht als Raumplan, sondern als Liste
                            dargestellt.
                        </Typography>
                    </Box>
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