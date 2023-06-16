import {Box, Button, Paper, TextField, Typography} from "@mui/material";
import * as yup from 'yup';
import {useAppDispatch, useAppSelector} from "../hooks";
import {useFormik} from "formik";
import {selectSystemConfig, setSystemConfig} from "../features/system-config";
import {SystemConfigKeys} from "../data/system-config-keys";
import {SaveOutlined, RestartAltOutlined} from '@mui/icons-material';


const validationSchema = yup.object({
    brand: yup
        .string()
        .required('Gib einen Namen für die Installation ein'),
});

export function SystemSettingsPage() {
    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
            brand: useAppSelector(selectSystemConfig(SystemConfigKeys.Brand, 'MultiSpace')),
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            dispatch(setSystemConfig({key: SystemConfigKeys.Brand, value: values.brand}));
        },
    });

    return (
        <Box>
            <Typography
                variant="h5"
                component="h1"
            >
                Systemeinstellungen
            </Typography>

            <Paper
                sx={{
                    mt: 4,
                    p: 4,
                }}
            >
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        label="Name der Installation"

                        id="brand"
                        name="brand"

                        value={formik.values.brand}
                        onChange={formik.handleChange}
                        error={formik.touched.brand && Boolean(formik.errors.brand)}
                        helperText={formik.touched.brand && formik.errors.brand}
                    />

                    <Box sx={{mt: 4}}>
                        <Button
                            color="primary"
                            variant="outlined"
                            type="submit"
                            sx={{mr: 2}}
                            startIcon={<SaveOutlined/>}
                        >
                            Speichern
                        </Button>

                        <Button
                            color="error"
                            variant="outlined"
                            type="reset"
                            onClick={() => formik.resetForm()}
                            startIcon={<RestartAltOutlined/>}
                        >
                            Zurücksetzen
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}
