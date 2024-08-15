import React, {useEffect, useState} from "react";
import {Box, Button, Icon, TableCell, Tooltip, Typography} from "@mui/material";
import {UserApiService} from "../services/rest-api-service";
import {ConfirmDialog} from "../dialogs/confirm-dialog";
import {TableView} from "../components/table-view";
import {User} from "../models/user";
import {AccountCircleOutlined} from "@mui/icons-material";
import {EditUserDialog} from "../dialogs/edit-user-dialog";
import {ApiService} from "../services/api-service";

export function ManageUsersPage() {
    const [users, setUsers] = useState<User[]>();

    const [userToEdit, setUserToEdit] = useState<User>();
    const [userToDelete, setUserToDelete] = useState<User>();

    useEffect(() => {
        UserApiService.list()
            .then(res => setUsers(res.results));
    }, []);

    const handleUserDelete = () => {
        if (users != null && userToDelete != null) {
            UserApiService.destroy(userToDelete?.id);
            setUsers(users.filter(usr => usr !== userToDelete));
            setUserToDelete(undefined);
        }
    };
    const handleUserChange = (user: User) => {
        if (users != null) {
            if (user.id === 0) {
                UserApiService.create(user)
                    .then(usr => ApiService.post('auth/set-password/', {user: usr.id, password: user.password}).then(_ => usr))
                    .then(usr => setUsers([usr, ...users]));
            } else {
                UserApiService.patch(user.id, user)
                    .then(usr => user.password != null && user.password.length > 0 ? ApiService.post('auth/set-password/', {user: usr.id, password: user.password}).then(_ => usr) : usr)
                    .then(res => setUsers(users.map(usr => usr !== user ? usr : res)));
            }

            setUserToEdit(undefined);
        }
    };

    return (
        <>
            <TableView
                label="Nutzerverwaltung"
                actions={[{
                    label: 'Nutzer hinzufügen',
                    onClick: () => setUserToEdit({
                        id: 0,
                        username: '',
                        is_staff: false,
                        first_name: '',
                        last_name: '',
                        password: '',
                    }),
                }]}
                columLabels={[
                    'Benutzername',
                    'Rolle',
                ]}
                filterItem={(item, search) => item.username.toLowerCase().includes(search)}
                data={users}
                cellBuilder={user => (
                    <>
                        <TableCell>
                            <Button
                                onClick={() => setUserToEdit(user)}
                                sx={{textTransform: 'none'}}
                            >
                                {user.username}
                            </Button>
                        </TableCell>

                        <TableCell>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Tooltip title={user.is_staff ? 'Administrator:in' : 'Mitarbeiter:in'}>
                                    <Icon color={user.is_staff ? 'success' : "disabled"}>
                                        <AccountCircleOutlined/>
                                    </Icon>
                                </Tooltip>

                                <Typography
                                    component="span"
                                    sx={{ml: 1}}
                                >
                                    {
                                        user.is_staff ? 'Administrator:in' : 'Mitarbeiter:in'
                                    }
                                </Typography>
                            </Box>
                        </TableCell>
                    </>
                )}
                getRowId={user => user.id}
                onDelete={setUserToDelete}
            />

            <ConfirmDialog
                title={`Nutzer "${userToDelete?.username ?? ''} löschen`}
                onClose={() => setUserToDelete(undefined)}
                onPositive={() => handleUserDelete()}
                open={userToDelete != null}
            >
                Soll der Nutzer <strong>{userToDelete?.username ?? ''}</strong> wirklich gelöscht werden?
            </ConfirmDialog>


            {
                userToEdit != null &&
                <EditUserDialog
                    user={userToEdit}
                    onSave={handleUserChange}
                    onCancel={() => setUserToEdit(undefined)}
                />
            }
        </>
    );
}