import React, {useEffect, useReducer, useState} from "react";
import {Floor} from "../models/floor";
import {Alert, AlertTitle, Box, Button} from "@mui/material";
import {DisplayKeysApiService} from "../services/rest-api-service";
import {ConfirmDialog} from "../dialogs/confirm-dialog";
import {DisplayKey} from "../models/display-key";
import {DisplayKeyTable} from "../components/display-key-table";
import {AddDisplayKeyDialog} from "../dialogs/add-display-key-dialog";

interface ManageFloorsEditPageTabDisplaysProps {
    floor: Floor;
}

export function ManageFloorsEditPageTabDisplays(props: ManageFloorsEditPageTabDisplaysProps) {
    const [displayKeys, setDisplayKeys] = useState<DisplayKey[]>([]);
    const [displayKeyToDelete, setDisplayKeyToDelete] = useState<DisplayKey>();

    const [showAddDisplayDialog, toggleShowAddDisplayDialog] = useReducer(p => !p, false);

    useEffect(() => {
        DisplayKeysApiService.list({floor: props.floor.id})
            .then(res => setDisplayKeys(res.results));
    }, []);

    const handleAddDisplayKey = (title: string) => {
        DisplayKeysApiService.create({
            id: '',
            floor: props.floor.id,
            title: title,
        }).then(res => setDisplayKeys([...displayKeys, res]));
        toggleShowAddDisplayDialog();
    };

    const handleDeleteDisplayKey = () => {
        if (displayKeyToDelete != null) {
            DisplayKeysApiService.destroy(displayKeyToDelete.id);
            setDisplayKeys(displayKeys.filter(fl => fl !== displayKeyToDelete));
            setDisplayKeyToDelete(undefined);
        }
    };

    return (
        <>
            <Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={toggleShowAddDisplayDialog}
                    >
                        Anzeige hinzufügen
                    </Button>
                </Box>

                <Box sx={{mt: 2}}>
                    {
                        displayKeys.length > 0 &&
                        <DisplayKeyTable
                            displayKeys={displayKeys}
                            onDelete={setDisplayKeyToDelete}
                        />
                    }

                    {
                        displayKeys.length === 0 &&
                        <Alert severity="info">
                            <AlertTitle>Keine Anzeigen vorhanden</AlertTitle>
                            Mit Anzeigen können Sie Bereiche zur Einsicht <u>ohne vorherige
                                                                             Authentifizierung</u> freigeben.
                            Jede Anzeige hat einen einzigartigen Link, über den der bereich eingesehen werden kann.
                            Legen Sie einfach eine neue Anzeige an und teilen Sie den Link.
                            So können Sie Bereiche beispielsweise auf einem Monitor in Ihren Geschäftsräumen anzeigen
                            lassen.
                        </Alert>
                    }
                </Box>
            </Box>

            <ConfirmDialog
                title={`Bereich "${displayKeyToDelete?.title} löschen`}
                onClose={() => setDisplayKeyToDelete(undefined)}
                onPositive={handleDeleteDisplayKey}
                open={displayKeyToDelete != null}
            >
                Soll der Bereich <strong>{displayKeyToDelete?.title}</strong> wirklich gelöscht werden?
            </ConfirmDialog>

            <AddDisplayKeyDialog
                onAdd={handleAddDisplayKey}
                open={showAddDisplayDialog}
                onClose={toggleShowAddDisplayDialog}
            />
        </>
    );
}
