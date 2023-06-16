import React, {useEffect, useReducer, useState} from "react";
import {Floor} from "../models/floor";
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemText, Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {User} from "../models/user";
import {AccessesApiService, UserApiService} from "../services/rest-api-service";
import {Access} from "../models/access";
import {FormDialog} from "../dialogs/form-dialog";
import {ConfirmDialog} from "../dialogs/confirm-dialog";
import {AccessTable} from "../components/access-table";
import {UserAccess} from "../models/user-access";

interface ManageFloorsEditPageTabAccessProps {
    floor: Floor;
}

export function ManageFloorsEditPageTabAccess(props: ManageFloorsEditPageTabAccessProps) {
    const [showAddUserDialog, toggleShowAddUserDialog] = useReducer(p => !p, false);
    const [accesses, setAccesses] = useState<UserAccess[]>([]);
    const [accessToRevoke, setAccessToRevoke] = useState<UserAccess>();

    useEffect(() => {
        AccessesApiService.list({floor: props.floor.id.toString()})
            .then(accessRes => {
                Promise.all(accessRes.results.map(acc => UserApiService.retrieve(acc.user)))
                    .then(userRes => setAccesses(accessRes.results.map((acc, index) => ({
                        user: userRes[index],
                        access: acc,
                    }))));
            })
    }, []);

    const handleAddAccess = (user: User) => {
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
    };

    const handleRevokeAccess = () => {
        if (accessToRevoke != null) {
            AccessesApiService.destroy(accessToRevoke.access.id);
            setAccesses(accesses.filter(acc => acc.access.id !== accessToRevoke.access.id));
            setAccessToRevoke(undefined);
        }
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mb: 2,
                }}
            >
                <Button
                    variant="contained"
                    onClick={toggleShowAddUserDialog}
                >
                    Nutzer Hinzufügen
                </Button>
            </Box>

            {
                accesses.length > 0 &&
                <AccessTable
                    accesses={accesses}
                    onDelete={setAccessToRevoke}
                />
            }

            {
                accesses.length === 0 &&
                <Alert
                    sx={{mt: 2}}
                    severity="info"
                >
                    <AlertTitle>Keine Zugangsberechtigten Nutzer</AlertTitle>
                    Für diesen Bereich existieren noch keine Zugangsberechtigten Nutzer.
                    Fügen sie jetzt einen Benutzer hinzu.
                </Alert>
            }

            <SelectUserDialog
                open={showAddUserDialog}
                onSelect={handleAddAccess}
                onCancel={toggleShowAddUserDialog}
            />

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
    open: boolean;
    onSelect: (user: User) => void;
    onCancel: () => void;
}

function SelectUserDialog(props: SelectUserDialogProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        UserApiService.list()
            .then(res => setUsers(res.results));
    }, []);

    return (
        <Dialog
            open={props.open}
            onClose={props.onCancel}
            fullWidth
        >
            <DialogTitle>
                Zugang gewähren
            </DialogTitle>

            <DialogContent>
                <TextField
                    fullWidth
                    label="Suchen"
                    sx={{mt: 2}}
                    value={search}
                    onChange={evt => setSearch(evt.target.value)}
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
            </DialogContent>

            <DialogActions>
                <Button onClick={props.onCancel}>
                    Abbrechen
                </Button>
            </DialogActions>
        </Dialog>
    );
}