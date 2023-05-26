import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {Floor} from "../models/floor";
import {FloorApiService} from "../services/rest-api-service";
import {Link} from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import {ConfirmDialog} from "../dialogs/confirm-dialog";

export function ManageFloorsPage() {
    const [floors, setFloors] = useState<Floor[]>([]);

    const [floor2Delete, setFloor2Delete] = useState<Floor>();

    useEffect(() => {
        FloorApiService.list(0, 999)
            .then(res => setFloors(res.results));
    }, []);

    return (
        <>
            <Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Typography
                        variant="h5"
                        component="h1"
                    >
                        Bereichsverwaltung
                    </Typography>

                    <Button
                        variant="outlined"
                        component={Link}
                        to={`/manage-floors/edit`}
                    >
                        Bereich hinzufügen
                    </Button>
                </Box>

                <Box sx={{mt: 4}}>
                    <TableContainer component={Paper}>
                        <Table
                            sx={{minWidth: 650}}
                            aria-label="simple table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Titel</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    floors.map((floor) => (
                                        <TableRow
                                            key={floor.id}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                {floor.name}
                                            </TableCell>

                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                <Button
                                                    component={Link}
                                                    to={`/manage-floors/edit/${floor.id}`}
                                                >
                                                    Bearbeiten
                                                </Button>


                                                <Button
                                                    startIcon={<DeleteIcon/>}
                                                    color="error"
                                                    sx={{ml: 2}}
                                                    onClick={() => setFloor2Delete(floor)}
                                                >
                                                    Löschen
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>

            <ConfirmDialog
                title={`Bereich "${floor2Delete?.name} löschen`}
                onClose={() => setFloor2Delete(undefined)}
                onPositive={() => {
                    if (floor2Delete != null) {
                        FloorApiService.destroy(floor2Delete.id);
                        setFloors(floors.filter(fl => fl !== floor2Delete));
                        setFloor2Delete(undefined);
                    }
                }}
                open={floor2Delete != null}
            >
                Soll der Bereich <strong>{floor2Delete?.name}</strong> wirklich gelöscht werden?
            </ConfirmDialog>
        </>
    );
}
