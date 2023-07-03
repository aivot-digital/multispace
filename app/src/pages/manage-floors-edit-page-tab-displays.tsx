import React, {useEffect, useReducer, useState} from "react";
import {Floor} from "../models/floor";
import {Alert, AlertTitle, TableCell} from "@mui/material";
import {DisplayKeysApiService} from "../services/rest-api-service";
import {ConfirmDialog} from "../dialogs/confirm-dialog";
import {DisplayKey} from "../models/display-key";
import {AddDisplayKeyDialog} from "../dialogs/add-display-key-dialog";
import {TableView} from "../components/table-view";
import {withDelay} from "../utils/with-delay";

interface ManageFloorsEditPageTabDisplaysProps {
    floor: Floor;
}

export function ManageFloorsEditPageTabDisplays(props: ManageFloorsEditPageTabDisplaysProps) {
    const [displayKeys, setDisplayKeys] = useState<DisplayKey[]>();
    const [displayKeyToDelete, setDisplayKeyToDelete] = useState<DisplayKey>();

    const [showAddDisplayDialog, toggleShowAddDisplayDialog] = useReducer(p => !p, false);

    useEffect(() => {
        withDelay(
            () => DisplayKeysApiService.list({floor: props.floor.id}).then(res => res.results),
            keys => setDisplayKeys(keys),
            500);
    }, []);

    const handleAddDisplayKey = (title: string, anonymous: boolean) => {
        if (displayKeys != null) {
            DisplayKeysApiService.create({
                id: '',
                floor: props.floor.id,
                title: title,
                anonymous: anonymous,
            }).then(res => setDisplayKeys([...displayKeys, res]));
        }
        toggleShowAddDisplayDialog();
    };

    const handleDeleteDisplayKey = () => {
        if (displayKeys != null && displayKeyToDelete != null) {
            DisplayKeysApiService.destroy(displayKeyToDelete.id);
            setDisplayKeys(displayKeys.filter(dk => dk !== displayKeyToDelete));
            setDisplayKeyToDelete(undefined);
        }
    };

    return (
        <>
            <TableView
                actions={[{
                    label: 'Anzeige hinzufügen',
                    onClick: toggleShowAddDisplayDialog,
                }]}
                columLabels={['Titel', 'Benutzernamen', 'Link']}
                data={displayKeys}
                cellBuilder={dk => (
                    <>
                        <TableCell>
                            {dk.title}
                        </TableCell>

                        <TableCell>
                            {dk.anonymous ? 'Ausblenden' : 'Anzeigen'}
                        </TableCell>

                        <TableCell>
                            <a
                                href={`/#${dk.id}`}
                                target="_blank"
                            >
                                {dk.id}
                            </a>
                        </TableCell>
                    </>
                )}
                getRowId={dk => dk.id}
                onDelete={setDisplayKeyToDelete}
            />

            {
                displayKeys != null &&
                displayKeys.length === 0 &&
                <Alert
                    severity="info"
                    sx={{mt: 4}}
                >
                    <AlertTitle>Keine Anzeigen vorhanden</AlertTitle>
                    Mit Anzeigen können Sie Bereiche zur Einsicht <u>ohne vorherige
                                                                     Authentifizierung</u> freigeben.
                    Jede Anzeige hat einen einzigartigen Link, über den der bereich eingesehen werden kann.
                    Legen Sie einfach eine neue Anzeige an und teilen Sie den Link.
                    So können Sie Bereiche beispielsweise auf einem Monitor in Ihren Geschäftsräumen anzeigen
                    lassen.
                </Alert>
            }

            <ConfirmDialog
                title={`Bereich "${displayKeyToDelete?.title} löschen`}
                onClose={() => setDisplayKeyToDelete(undefined)}
                onPositive={handleDeleteDisplayKey}
                open={displayKeyToDelete != null}
            >
                Soll der Bereich <strong>{displayKeyToDelete?.title}</strong> wirklich gelöscht werden?
            </ConfirmDialog>

            {
                showAddDisplayDialog &&
                <AddDisplayKeyDialog
                    onAdd={handleAddDisplayKey}
                    onClose={toggleShowAddDisplayDialog}
                />
            }
        </>
    );
}
