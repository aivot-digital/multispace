import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle} from "@mui/material";
import {FormikConfig, FormikValues, useFormik} from "formik";
import {authenticate} from "../features/user";

interface FormDialogProps<T extends FormikValues> {
    title: string;
    submitLabel?: string;
    cancelLabel?: string;

    form: FormikConfig<T>;

    onCancel: () => void;
    builder: (formik: any) => React.ReactNode | React.ReactNode[];

    additionalButtons?: React.ReactNode | React.ReactNode[];
}

export function FormDialog<T extends FormikValues>(props: FormDialogProps<T> & DialogProps) {
    const {
        title,
        builder,
        submitLabel,
        cancelLabel,
        form,
        onCancel,
        additionalButtons,
        ...dialogProps
    } = props;

    const formik = useFormik<T>(form);

    const handleCancel = () => {
        formik.resetForm();
        onCancel();
    };

    return (
        <Dialog
            {...dialogProps}
            onClose={handleCancel}
        >
            <DialogTitle>
                {title}
            </DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    {builder(formik)}
                </DialogContent>
                <DialogActions>
                    {additionalButtons}

                    <Button type="submit">
                        {submitLabel ?? 'Speichern'}
                    </Button>

                    <Button
                        type="button"
                        onClick={handleCancel}
                        autoFocus
                    >
                        {cancelLabel ?? 'Abbrechen'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
