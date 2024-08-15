import React, {useEffect, useState} from "react";
import {Floor} from "../models/floor";
import {FloorPlan} from "../components/floor-plan";
import {Box, Button, Skeleton} from "@mui/material";
import {Desk} from "../models/desk";
import {DesksApiService} from "../services/rest-api-service";
import {EditDeskDialog} from "../dialogs/edit-desk-dialog";
import {withDelay} from "../utils/with-delay";
import {useAppDispatch} from "../hooks";
import {addMessage} from "../features/app";

interface ManageFloorsEditPageTabDesksProps {
    floor: Floor;
}

function fetchDesks(floor: Floor) {
    return DesksApiService
        .list({
            floor: floor.id,
        })
        .then(res => res.results);
}

function createDesk(floor: Floor, offset: number) {
    return DesksApiService.create({
        id: 0,
        name: 'Tisch Nr. ' + offset,
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

export function ManageFloorsEditPageTabDesks(props: ManageFloorsEditPageTabDesksProps) {
    const dispatch = useAppDispatch();
    const [desks, setDesks] = useState<Desk[]>();
    const [deskToEdit, setDeskToEdit] = useState<Desk>();

    useEffect(() => {
        withDelay(
            () => fetchDesks(props.floor),
            setDesks,
            500,
        );
    }, []);

    const handleAddDesk = () => {
        if (desks != null) {
            createDesk(props.floor, desks.length + 1)
                .then(res => setDesks([
                    ...desks,
                    res,
                ]));
        }
    };

    const handleSavePositions = () => {
        if (desks != null) {
            Promise.all(desks.map(d => DesksApiService.patch(d.id, d)));
            dispatch(addMessage({
                id: 'desk_positions_saved',
                title: 'Positionen gespeichert',
                message: 'Positionen der Tische erfolgreich gespeichert',
                severity: 'success',
            }));
        }
    };

    const handleDeskSave = (desk: Desk) => {
        if (desks != null) {
            DesksApiService.patch(desk.id, desk);
            setDesks(desks.map(d => d.id === desk.id ? desk : d));
            setDeskToEdit(undefined);
        }
    };

    const handleDeskDelete = (desk: Desk) => {
        if (desks != null) {
            DesksApiService.destroy(desk.id);
            setDesks(desks.filter(d => d.id !== desk.id));
            setDeskToEdit(undefined);
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
                    disabled={desks == null}
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
                    desks == null &&
                    <Skeleton
                        variant="rectangular"
                        height="100%"
                    />
                }

                {
                    desks != null &&
                    <FloorPlan
                        floor={props.floor}
                        desks={desks}
                        onAddDesk={handleAddDesk}
                        onChangeDesks={setDesks}
                        onDeskClick={desk => setDeskToEdit({...desk})}
                    />
                }
            </Box>

            {
                deskToEdit != null &&
                <EditDeskDialog
                    desk={deskToEdit}
                    onClose={() => setDeskToEdit(undefined)}
                    onDelete={handleDeskDelete}
                    onSave={handleDeskSave}
                />
            }
        </>
    );
}
