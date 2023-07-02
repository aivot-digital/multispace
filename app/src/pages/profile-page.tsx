import {Box, Button, Paper, TextField, Typography, useTheme} from "@mui/material";
import {useAppSelector} from "../hooks";
import * as yup from 'yup';
import {useFormik} from "formik";
import {RestartAltOutlined, SaveOutlined} from "@mui/icons-material";
import {ApiService} from "../services/api-service";

const validationSchema = yup.object({
    password: yup
        .string()
        .defined()
        .required('Das Passwort ist eine Pflichtangabe')
        .min(8, 'Das Passwort muss mindestens 8 Zeichen haben')
        .max(72, 'Das Passwort darf maximal 72 Zeichen haben'),
    passwordTwo: yup
        .string()
        .defined()
        .required('Die Wiederholung des Passworts ist eine Pflichtangabe')
        .oneOf([yup.ref('password')], 'Die eingegebenen Passwörter stimmen nicht überein'),
});

export function ProfilePage() {
    const theme = useTheme();
    const userId = useAppSelector(state => state.user.userId);

    const formik = useFormik({
        initialValues: {
            password: '',
            passwordTwo: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (userId != null) {
                ApiService.post('auth/set-password/', {
                    user: userId,
                    password: values.password,
                });
                formik.resetForm();
            }
        },
    });

    return (
        <Box>
            <Box>
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{mb: 4}}
                >
                    Passwort ändern
                </Typography>

                <form onSubmit={formik.handleSubmit}>
                    <Paper
                        sx={{
                            py: 1,
                            px: 2,
                            mb: 4,
                            [theme.breakpoints.up('sm')]: {
                                py: 2,
                                px: 4,
                            },
                        }}
                    >
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Passwort"
                            type="password"

                            id="password"
                            name="password"
                            required

                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Passwort wiederholen"
                            type="password"

                            id="passwordTwo"
                            name="passwordTwo"
                            required

                            value={formik.values.passwordTwo}
                            onChange={formik.handleChange}
                            error={formik.touched.passwordTwo && Boolean(formik.errors.passwordTwo)}
                            helperText={formik.touched.passwordTwo && formik.errors.passwordTwo}
                        />
                    </Paper>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',

                            [theme.breakpoints.up('sm')]: {
                                flexDirection: 'row',
                            },
                        }}
                    >
                        <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                            startIcon={<SaveOutlined/>}
                        >
                            Speichern
                        </Button>

                        <Button
                            color="error"
                            variant="contained"
                            type="reset"
                            startIcon={<RestartAltOutlined/>}
                            onClick={() => formik.resetForm()}
                            sx={{
                                mt: 2,
                                [theme.breakpoints.up('sm')]: {
                                    mt: 0,
                                    ml: 2,
                                },
                            }}
                        >
                            Zurücksetzen
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}
