import {Box, Button, Paper, TextField, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../hooks";
import * as yup from 'yup';
import {authenticate} from "../features/user";
import {selectSystemConfig} from "../features/system-config";
import {SystemConfigKeys} from "../data/system-config-keys";
import {useFormik} from "formik";
import LoginBackground from '../assets/login-background.jpg';

const validationSchema = yup.object({
    username: yup
        .string()
        .defined()
        .required('Benutzername ist eine Pflichtangabe'),
    password: yup
        .string()
        .defined()
        .required('Passwort ist eine Pflichtangabe'),
});

export function LoginPage() {
    const dispatch = useAppDispatch();

    const brand = useAppSelector(selectSystemConfig(SystemConfigKeys.Brand, 'MultiSpace'));

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            dispatch(authenticate({
                username: values.username,
                password: values.password,
            }));
        },
    });

    return (
        <Box
            sx={{
                display: 'flex',
                width: '100vw',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: `url(${LoginBackground})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}
        >
            <Paper sx={{width: '22em', px: 4, py: 8}}>
                <Typography
                    align="center"
                    variant="h4"
                    sx={{mb: 4}}
                >
                    {brand}
                </Typography>

                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        sx={{mb: 2}}
                        label="Benutzername"

                        id="username"
                        name="username"

                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                    />

                    <TextField
                        fullWidth
                        sx={{mb: 2}}
                        label="Passwort"
                        type="password"

                        id="password"
                        name="password"

                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />

                    <Button
                        fullWidth
                        color="primary"
                        variant="outlined"
                        type="submit"
                    >
                        Anmelden
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}
