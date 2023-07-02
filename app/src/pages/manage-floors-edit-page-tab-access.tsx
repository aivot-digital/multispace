import React, {ChangeEvent, useEffect, useReducer, useState} from "react";
import {Floor} from "../models/floor";
import {
    Alert,
    AlertTitle,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    TableCell,
    TextField
} from "@mui/material";
import {User} from "../models/user";
import {AccessesApiService, UserApiService} from "../services/rest-api-service";
import {ConfirmDialog} from "../dialogs/confirm-dialog";
import {UserAccess} from "../models/user-access";
import {TableView} from "../components/table-view";
import {withDelay} from "../utils/with-delay";

interface ManageFloorsEditPageTabAccessProps {
    floor: Floor;
}

export function ManageFloorsEditPageTabAccess(props: ManageFloorsEditPageTabAccessProps) {
    const [showAddUserDialog, toggleShowAddUserDialog] = useReducer(p => !p, false);
    const [accesses, setAccesses] = useState<UserAccess[]>();
    const [accessToRevoke, setAccessToRevoke] = useState<UserAccess>();

    useEffect(() => {
        withDelay(
            () => {
                return AccessesApiService.list({floor: props.floor.id.toString()})
                    .then(accessRes => {
                        return Promise.all(accessRes.results.map(acc => UserApiService.retrieve(acc.user)))
                            .then(userRes => accessRes.results.map((acc, index) => ({
                                user: userRes[index],
                                access: acc,
                            })));
                    })
            },
            accesses => setAccesses(accesses),
            500,
        );
    }, []);

    const handleAddAccess = (user: User) => {
        if (accesses != null) {
            AccessesApiService.create({
                floor: props.floor.id,
                user: user.id,
                id: 0,
                is_maintainer: false,
            })
                .then(acc => {
                    setAccesses([
                        ...accesses,
                        {
                            access: acc,
                            user: user,
                        }
                    ]);
                })
            toggleShowAddUserDialog();
        }
    };

    const handleRevokeAccess = () => {
        if (accesses != null && accessToRevoke != null) {
            AccessesApiService.destroy(accessToRevoke.access.id);
            setAccesses(accesses.filter(acc => acc.access.id !== accessToRevoke.access.id));
            setAccessToRevoke(undefined);
        }
    };

    return (
        <>
            <TableView
                actions={[{
                    label: 'Nutzer Hinzufügen',
                    onClick: toggleShowAddUserDialog,
                }]}
                columLabels={['Benutzer']}
                data={accesses}
                cellBuilder={access => (
                    <TableCell>
                        {access.user.username}
                    </TableCell>
                )}
                onDelete={setAccessToRevoke}
                getRowId={access => access.access.id}
                filterItem={(access, search) => access.user.username.toLowerCase().includes(search)}
            />

            {
                accesses != null &&
                accesses.length === 0 &&
                <Alert
                    sx={{mt: 4}}
                    severity="info"
                >
                    <AlertTitle>Keine Zugangsberechtigten Nutzer</AlertTitle>
                    Für diesen Bereich existieren noch keine Zugangsberechtigten Nutzer.
                    Fügen sie jetzt einen Benutzer hinzu.
                </Alert>
            }

            {
                accesses != null &&
                showAddUserDialog &&
                <SelectUserDialog
                    onSelect={handleAddAccess}
                    onCancel={toggleShowAddUserDialog}
                    existingAccesses={accesses}
                />
            }

            <ConfirmDialog
                title="Zugang entfernen"
                onClose={() => setAccessToRevoke(undefined)}
                onPositive={handleRevokeAccess}
                open={accessToRevoke != null}
            >
                Soll der Zugang für <strong>{accessToRevoke?.user.username}</strong> wirklich entfernt werden?
            </ConfirmDialog>
        </>
    );
}

interface SelectUserDialogProps {
    onSelect: (user: User) => void;
    onCancel: () => void;
    existingAccesses: UserAccess[];
}

function SelectUserDialog(props: SelectUserDialogProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        UserApiService.list()
            .then(res => setUsers(res.results.filter(usr => !props.existingAccesses.some(acc => acc.user.id === usr.id))));
    }, []);

    return (
        <Dialog
            open={true}
            onClose={props.onCancel}
            fullWidth
        >
            <DialogTitle>
                Zugang gewähren
            </DialogTitle>

            <DialogContent>
                {
                    users.length > 0 &&
                    <>
                        <TextField
                            fullWidth
                            label="Suchen"
                            sx={{mt: 2}}
                            value={search}
                            onChange={(evt: ChangeEvent<HTMLInputElement>) => setSearch(evt.target.value)}
                        />

                        <List>
                            {
                                users
                                    .filter(usr => usr.username.toLowerCase().includes(search.toLowerCase()))
                                    .map(usr => (
                                        <ListItem key={usr.id}>
                                            <ListItemButton onClick={() => props.onSelect(usr)}>
                                                <ListItemText>
                                                    {usr.username}
                                                </ListItemText>
                                            </ListItemButton>
                                        </ListItem>
                                    ))
                            }
                        </List>
                    </>
                }

                {
                    users.length === 0 &&
                    <Alert
                        severity="info"
                        sx={{mt: 2}}
                    >
                        Bereits alle Nutzer hinzugefügt.
                    </Alert>
                }
            </DialogContent>

            <DialogActions>
                <Button onClick={props.onCancel}>
                    Abbrechen
                </Button>
            </DialogActions>
        </Dialog>
    );
}