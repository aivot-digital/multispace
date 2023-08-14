import React, {useEffect, useState} from "react";
import {Button, TableCell} from "@mui/material";
import {Floor} from "../models/floor";
import {FloorApiService} from "../services/rest-api-service";
import {Link, useNavigate} from "react-router-dom";
import {ConfirmDialog} from "../dialogs/confirm-dialog";
import {TableView} from "../components/table-view";

export function ManageFloorsPage() {
    const navigate = useNavigate();

    const [floors, setFloors] = useState<Floor[]>([]);

    const [floorToDelete, setFloorToDelete] = useState<Floor>();

    useEffect(() => {
        FloorApiService.list()
            .then(res => setFloors(res.results));
    }, []);

    return (
        <>
            <TableView
                label="Bereichsverwaltung"
                actions={[{
                    label: 'Bereich hinzufügen',
                    onClick: () => navigate('/manage-floors/edit')
                }]}
                columLabels={[
                    'Bereichsname',
                    'Anzahl Tische',
                    'Anzahl Räume',
                    'Anzahl Zugangsberechtigt',
                ]}
                data={floors}
                cellBuilder={floor => (
                    <>
                        <TableCell>
                            <Button
                                component={Link}
                                to={`/manage-floors/edit/${floor.id}`}
                                sx={{textTransform: 'none'}}
                            >
                                {floor.name}
                            </Button>
                        </TableCell>

                        <TableCell>
                            {floor.desk_count}
                        </TableCell>

                        <TableCell>
                            {floor.room_count}
                        </TableCell>

                        <TableCell>
                            {floor.access_count}
                        </TableCell>
                    </>
                )}
                getRowId={floor => floor.id}
                onDelete={setFloorToDelete}
            />

            <ConfirmDialog
                title={`Bereich "${floorToDelete?.name}" löschen`}
                onClose={() => setFloorToDelete(undefined)}
                onPositive={() => {
                    if (floorToDelete != null) {
                        FloorApiService.destroy(floorToDelete.id);
                        setFloors(floors.filter(fl => fl !== floorToDelete));
                        setFloorToDelete(undefined);
                    }
                }}
                open={floorToDelete != null}
            >
                Soll der Bereich <strong>{floorToDelete?.name}</strong> wirklich gelöscht werden?
            </ConfirmDialog>
        </>
    );
}
