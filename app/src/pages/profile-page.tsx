import {Box, Button, TextField, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../hooks";
import * as yup from 'yup';
import {authenticate} from "../features/user";
import {selectSystemConfig} from "../features/system-config";
import {SystemConfigKeys} from "../data/system-config-keys";
import {useFormik} from "formik";
import {UserApiService} from "../services/rest-api-service";

const validationSchema = yup.object({
    password: yup
        .string()
        .defined()
        .required('Das Passwort ist eine Pflichtangabe'),
    passwordTwo: yup
        .string()
        .defined()
        .required('Die Wiederholung des Passworts ist eine Pflichtangabe'),
});

export function ProfilePage() {
    const userId = useAppSelector(state => state.user.userId);

    const formik = useFormik({
        initialValues: {
            password: '',
            passwordTwo: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (userId != null) {
                UserApiService.patch(userId, {
                    password: values.password,
                });
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
                    <TextField
                        fullWidth
                        sx={{mb: 2}}
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
                        sx={{mb: 2}}
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

                    <Button
                        color="primary"
                        variant="outlined"
                        type="submit"
                    >
                        Speichern
                    </Button>
                </form>
            </Box>
        </Box>
    );
}
