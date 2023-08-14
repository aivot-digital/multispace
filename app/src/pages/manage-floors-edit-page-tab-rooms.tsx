import React, {useEffect, useState} from "react";
import {Floor} from "../models/floor";
import {FloorPlan} from "../components/floor-plan";
import {Box, Button, Skeleton} from "@mui/material";
import {Room} from "../models/room";
import {RoomsApiService} from "../services/rest-api-service";
import {withDelay} from "../utils/with-delay";
import {addMessage} from "../features/app";
import {useAppDispatch} from "../hooks";
import {EditRoomDialog} from "../dialogs/edit-room-dialog";

interface ManageFloorsEditPageTabRoomsProps {
    floor: Floor;
}

function fetchRooms(floor: Floor) {
    return RoomsApiService
        .list({
            floor: floor.id,
        })
        .then(res => res.results);
}

function createRoom(floor: Floor, offset: number) {
    return RoomsApiService.create({
        id: 0,
        name: 'Raum Nr. ' + offset,
        floor: floor.id,
        height: 100,
        width: 50,
        orientation: 0,
        pos_x: 100,
        pos_y: 100,
        description: '',
        tags: [],
    });
}

export function ManageFloorsEditPageTabRooms(props: ManageFloorsEditPageTabRoomsProps) {
    const dispatch = useAppDispatch();
    const [rooms, setRooms] = useState<Room[]>();
    const [roomToEdit, setRoomToEdit] = useState<Room>();

    useEffect(() => {
        withDelay(
            () => fetchRooms(props.floor),
            setRooms,
            500,
        );
    }, [props.floor]);

    const handleAddRoom = () => {
        if (rooms != null) {
            createRoom(props.floor, rooms.length)
                .then(res => setRooms([
                    ...rooms,
                    res,
                ]));
        }
    };

    const handleSavePositions = () => {
        if (rooms != null) {
            Promise.all(rooms.map(d => RoomsApiService.patch(d.id, d)));
            dispatch(addMessage({
                id: 'room_positions_saved',
                title: 'Positionen gespeichert',
                message: 'Positionen der Räume erfolgreich gespeichert',
                severity: 'success',
            }));
        }
    };

    const handleRoomSave = (room: Room) => {
        if (rooms != null) {
            RoomsApiService.patch(room.id, room);
            setRooms(rooms.map(d => d.id === room.id ? room : d));
            setRoomToEdit(undefined);
        }
    };

    const handleRoomDelete = (room: Room) => {
        if (rooms != null) {
            RoomsApiService.destroy(room.id);
            setRooms(rooms.filter(d => d.id !== room.id));
            setRoomToEdit(undefined);
        }
    };

    return (
        <>
            <Box sx={{mb: 2}}>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleSavePositions}
                    size="small"
                    disabled={rooms == null}
                >
                    Positionen & Größen Speichern
                </Button>
            </Box>

            <Box
                sx={{
                    height: 'calc(100vh - 320px)',
                }}
            >
                {
                    rooms == null &&
                    <Skeleton
                        variant="rectangular"
                        height="100%"
                    />
                }

                {
                    rooms != null &&
                    <FloorPlan
                        floor={props.floor}
                        rooms={rooms}
                        onAddRoom={handleAddRoom}
                        onChangeRooms={setRooms}
                        onRoomClick={room => setRoomToEdit({...room})}
                    />
                }

                {
                    roomToEdit != null &&
                    <EditRoomDialog
                        room={roomToEdit}
                        onClose={() => setRoomToEdit(undefined)}
                        onDelete={handleRoomDelete}
                        onSave={handleRoomSave}
                    />
                }
            </Box>
        </>
    );
}
