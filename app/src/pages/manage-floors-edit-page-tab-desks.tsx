import React, {useEffect, useState} from "react";
import {Floor} from "../models/floor";
import {FloorPlan} from "../components/floor-plan";
import {Box, Button, Dialog, DialogContent, DialogTitle, TextField} from "@mui/material";
import {Desk} from "../models/desk";
import {DesksApiService} from "../services/rest-api-service";

interface ManageFloorsEditPageTabDesksProps {
    floor: Floor;
    desks: Desk[];
    onChange: (desks: Desk[]) => void;
}

export function ManageFloorsEditPageTabDesks(props: ManageFloorsEditPageTabDesksProps) {
    const [desks, setDesks] = useState<Desk[]>([]);
    const [deskToEdit, setDeskToEdit] = useState<Desk>();

    useEffect(() => {
        DesksApiService.list({floor: props.floor.id.toString()})
            .then(res => {
                setDesks(res.results);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const handleAddDesk = () => {
        DesksApiService.create({
            id: 0,
            name: 'Neuer Tisch',
            floor: props.floor.id,
            height: 100,
            width: 50,
            orientation: 0,
            pos_x: 100,
            pos_y: 100,
            description: '',
            tags: [],
        })
            .then(res => setDesks([
                ...desks,
                res,
            ]))
            .catch(err => {
                console.error(err);
            });
    };

    const handleSave = () => {
        if (desks != null) {
            Promise.all(desks.map(d => DesksApiService.patch(d.id, d)));
        }
    };

    const handleDelete = () => {
        // TODO
    };

    return (
        <Box
            sx={{
                height: 'calc(100vh - 320px)',
            }}
        >
            <FloorPlan
                floor={props.floor}
                desks={desks}
                onAddDesk={handleAddDesk}
                onChangeDesks={setDesks}
                onDeskClick={desk => setDeskToEdit({...desk})}
            />

            <Box sx={{mt: 4}}>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleSave}
                >
                    Speichern
                </Button>
            </Box>

            <Dialog
                open={deskToEdit != null}
                onClose={() => setDeskToEdit(undefined)}
            >
                <DialogTitle>
                    Tisch bearbeiten
                </DialogTitle>

                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Name des Tisches"
                        value={deskToEdit?.name ?? ''}
                        onChange={evt => {
                            if (deskToEdit != null) {
                                setDeskToEdit({
                                    ...deskToEdit,
                                    name: evt.target.value ?? '',
                                });
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Beschreibung des Tisches"
                        value={deskToEdit?.description ?? ''}
                        onChange={evt => {
                            if (deskToEdit != null) {
                                setDeskToEdit({
                                    ...deskToEdit,
                                    description: evt.target.value ?? '',
                                });
                            }
                        }}
                        multiline
                        rows={4}
                    />

                    <Box>
                        <Button
                            onClick={handleDelete}
                            color="error"
                        >
                            Löschen
                        </Button>

                        <Button
                            onClick={() => {
                                setDesks((desks ?? []).map(d => deskToEdit != null && d.id === deskToEdit.id ? deskToEdit : d));
                                setDeskToEdit(undefined);
                            }}
                        >
                            Speichern
                        </Button>

                        <Button
                            onClick={() => setDeskToEdit(undefined)}
                        >
                            Abbrechen
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
