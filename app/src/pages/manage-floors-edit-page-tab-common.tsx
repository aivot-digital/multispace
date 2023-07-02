import React, {useRef} from "react";
import {Button, Paper, TextField} from "@mui/material";
import {Floor} from "../models/floor";
import {useNavigate} from "react-router-dom";
import * as yup from 'yup';
import {useFormik} from "formik";
import {ApiService} from "../services/api-service";
import {useAppDispatch} from "../hooks";
import {addMessage, hideLoading, showLoading} from "../features/app";

const newFloorValidationSchema = yup.object({
    name: yup
        .string()
        .required('Der Name ist ein Pflichtfeld'),
    image: yup
        .string()
        .required('Das Bild ist ein Pflichtfeld'),
});

const existingFloorValidationSchema = yup.object({
    name: yup
        .string()
        .required('Der Name ist ein Pflichtfeld'),
    image: yup
        .string(),
});

interface ManageFloorsEditPageTabCommonProps {
    floor: Floor;
    onChange: (floor: Floor) => void;
}

export function ManageFloorsEditPageTabCommon(props: ManageFloorsEditPageTabCommonProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isNewFloor = props.floor.id === 0;
    const fileRef = useRef<HTMLInputElement>(null);

    const formik = useFormik({
        initialValues: {
            name: props.floor.name ?? '',
            image: '',
        },
        validationSchema: isNewFloor ? newFloorValidationSchema : existingFloorValidationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            dispatch(showLoading());

            const data = new FormData();
            data.append('name', values.name);
            if (fileRef.current!.files![0] != null) {
                data.append('image', fileRef.current!.files![0]);
            }

            if (isNewFloor) {
                ApiService.postFormData<Floor>('floors/', data)
                    .then((res) => {
                        navigate('/manage-floors/edit/' + res.id);
                    })
                    .catch(err => {
                        console.error(err);
                        dispatch(addMessage({
                            id: 'failed_to_create_floor',
                            title: 'Bereich konnte nicht angelegt werden',
                            message: 'Bereich konnte nicht angelegt werden. Probieren Sie es später erneut.',
                            severity: 'error',
                        }));
                    })
                    .finally(() => {
                        dispatch(hideLoading());
                    });
            } else {
                ApiService.patchFormData<Floor>(`floors/${props.floor.id}/`, data)
                    .then((res) => {
                        props.onChange(res);
                    })
                    .catch(err => {
                        console.error(err);
                        dispatch(addMessage({
                            id: 'failed_to_create_floor',
                            title: 'Bereich konnte nicht angelegt werden',
                            message: 'Bereich konnte nicht angelegt werden. Probieren Sie es später erneut.',
                            severity: 'error',
                        }));
                    })
                    .finally(() => {
                        dispatch(hideLoading());
                    });
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Paper sx={{p: 4, mb: 4}}>
                <TextField
                    fullWidth
                    margin="normal"

                    id="name"
                    name="name"
                    label="Name des Bereichs"

                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    inputRef={fileRef}

                    id="image"
                    name="image"
                    label="Raumplan"
                    type="file"
                    inputProps={{
                        accept: 'image/*',
                    }}

                    InputLabelProps={{
                        shrink: true,
                    }}

                    value={formik.values.image}
                    onChange={formik.handleChange}
                    error={formik.touched.image && Boolean(formik.errors.image)}
                    helperText={formik.touched.image && formik.errors.image}
                />
            </Paper>

            <Button
                color="primary"
                variant="contained"
                type="submit"
            >
                Speichern
            </Button>
        </form>
    );
}
