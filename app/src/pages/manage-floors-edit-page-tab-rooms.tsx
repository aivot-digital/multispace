import React, {useEffect, useState} from "react";
import {Floor} from "../models/floor";
import {FloorPlan} from "../components/floor-plan";
import {Box, Button, Dialog, DialogContent, DialogTitle, TextField} from "@mui/material";
import {Room} from "../models/room";
import {Desk} from "../models/desk";
import {DesksApiService, RoomsApiService} from "../services/rest-api-service";

interface ManageFloorsEditPageTabRoomsProps {
    floor: Floor;
    rooms: Room[];
    onChange: (rooms: Room[]) => void;
}

export function ManageFloorsEditPageTabRooms(props: ManageFloorsEditPageTabRoomsProps) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomToEdit, setRoomToEdit] = useState<Room>();

    useEffect(() => {
        RoomsApiService.list({floor: props.floor.id.toString()})
            .then(res => {
                setRooms(res.results);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const handleAddRoom = () => {
        RoomsApiService.create({
            id: 0,
            name: 'Neuer Raum',
            floor: props.floor.id,
            height: 100,
            width: 50,
            orientation: 0,
            pos_x: 100,
            pos_y: 100,
            description: '',
            tags: [],
        })
            .then(res => setRooms([
                ...rooms,
                res,
            ]))
            .catch(err => {
                console.error(err);
            });
    };

    const handleSave = () => {
        if (rooms != null) {
            Promise.all(rooms.map(d => RoomsApiService.patch(d.id, d)));
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
                rooms={rooms}
                onAddRoom={handleAddRoom}
                onChangeRooms={setRooms}
                onRoomClick={room => setRoomToEdit({...room})}
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
                open={roomToEdit != null}
                onClose={() => setRoomToEdit(undefined)}
            >
                <DialogTitle>
                    Raum bearbeiten
                </DialogTitle>

                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Name des Raums"
                        value={roomToEdit?.name ?? ''}
                        onChange={evt => {
                            if (roomToEdit != null) {
                                setRoomToEdit({
                                    ...roomToEdit,
                                    name: evt.target.value ?? '',
                                });
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Beschreibung des Raums"
                        value={roomToEdit?.description ?? ''}
                        onChange={evt => {
                            if (roomToEdit != null) {
                                setRoomToEdit({
                                    ...roomToEdit,
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
                                setRooms((rooms ?? []).map(d => roomToEdit != null && d.id === roomToEdit.id ? roomToEdit : d));
                                setRoomToEdit(undefined);
                            }}
                        >
                            Speichern
                        </Button>

                        <Button
                            onClick={() => setRoomToEdit(undefined)}
                        >
                            Abbrechen
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
