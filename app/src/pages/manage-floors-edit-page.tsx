import React, {useEffect, useRef, useState} from "react";
import {Box, Button, TextField, Typography} from "@mui/material";
import {Floor} from "../models/floor";
import {FloorApiService} from "../services/rest-api-service";
import {useParams} from "react-router-dom";
import * as yup from 'yup';
import {useFormik} from "formik";
import {ApiService} from "../services/api-service";

const validationSchema = yup.object({
    name: yup
        .string()
        .required('Der Name ist ein Pflichtfeld'),
    image: yup
        .string()
        .required('Das Bild ist ein Pflichtfeld'),
});

export function ManageFloorsEditPage() {
    const {id} = useParams();

    const fileRef = useRef<HTMLInputElement>(null);
    const [floor, setFloor] = useState<Floor>();

    useEffect(() => {
        if (id != null) {
            FloorApiService.retrieve(id)
                .then(res => setFloor(res));
        } else {
            setFloor({
                id: -1,
                name: '',
                image: '',
            });
        }
    }, [id]);

    const formik = useFormik({
        initialValues: {
            name: floor?.name ?? '',
            image: floor?.image ?? '',
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            const data = new FormData();
            data.append('name', values.name);
            data.append('image', fileRef.current!.files![0]);
            console.log(values);
            ApiService.postFormData('floors/', data);
        },
    });

    return (
        <Box>
            <Typography
                variant="h5"
                component="h1"
            >
                Bereich {floor?.name ?? ''}
            </Typography>

            <Box sx={{mt: 4}}>

                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        sx={{mb: 3}}

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
                        sx={{mb: 3}}
                        inputRef={fileRef}

                        id="image"
                        name="image"
                        label="Raumplan"
                        type="file"
                        inputProps={{
                            accept: 'image/*',
                        }}

                        value={formik.values.image}
                        onChange={formik.handleChange}
                        error={formik.touched.image && Boolean(formik.errors.image)}
                        helperText={formik.touched.image && formik.errors.image}
                    />

                    <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                    >
                        Speichern
                    </Button>
                </form>
            </Box>
        </Box>
    );
}
