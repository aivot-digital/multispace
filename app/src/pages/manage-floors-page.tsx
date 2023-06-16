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
import {FloorTable} from "../components/floor-table";

export function ManageFloorsPage() {
    const [floors, setFloors] = useState<Floor[]>([]);

    const [floor2Delete, setFloor2Delete] = useState<Floor>();

    useEffect(() => {
        FloorApiService.list()
            .then(res => setFloors(res.results));
    }, []);

    return (
        <>
            <Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography
                        variant="h5"
                        component="h1"
                    >
                        Bereichsverwaltung
                    </Typography>

                    <Button
                        variant="contained"
                        component={Link}
                        to={`/manage-floors/edit`}
                    >
                        Bereich hinzufügen
                    </Button>
                </Box>

                <Box
                    sx={{
                        mt: 4,
                    }}
                >
                    <FloorTable
                        floors={floors}
                        onDelete={setFloor2Delete}
                    />
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
