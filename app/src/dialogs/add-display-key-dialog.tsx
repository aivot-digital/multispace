import {DialogProps, TextField} from "@mui/material";
import {FormDialog} from "./form-dialog";
import {FormikConfig} from "formik";
import * as yup from "yup";


const validationSchema = yup.object({
    title: yup
        .string()
        .defined()
        .required('Der Titel ist eine Pflichtangabe'),
});

interface AddDisplayKeyDialogProps {
    onAdd: (title: string) => void;
    onClose: () => void;
}

export function AddDisplayKeyDialog(props: AddDisplayKeyDialogProps & DialogProps) {
    const {
        onAdd,
        ...dialogProps
    } = props;

    const formikConfig: FormikConfig<{ title: string, }> = {
        initialValues: {
            title: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            props.onAdd(values.title);
        },
    };

    const handleCancel = () => {
        props.onClose();
    };

    return (
        <FormDialog
            {...dialogProps}
            title="Anzeige hinzufügen"
            onCancel={handleCancel}
            form={formikConfig}
            builder={formik => (
                <TextField
                    fullWidth
                    label="Titel der Anzeige"

                    id="title"
                    name="title"

                    value={formik.values.username}
                    onChange={formik.handleChange}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username}
                />
            )}
        />
    );
}