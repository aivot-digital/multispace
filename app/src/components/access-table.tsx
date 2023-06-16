import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";
import {UserAccess} from "../models/user-access";
import DeleteIcon from "@mui/icons-material/Delete";

interface AccessTableProps {
    accesses: UserAccess[];
    onDelete: (access: UserAccess) => void;
}

export function AccessTable(props: AccessTableProps) {
    return (
        <TableContainer
            component={Paper}
        >
            <Table
                sx={{
                    '& tbody tr:last-child td': {
                        borderBottom: 'none',
                    },
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Benutzer
                        </TableCell>
                        <TableCell/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.accesses.map(access => (
                            <TableRow key={access.access.id}>
                                <TableCell>
                                    {access.user.username}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        color="error"
                                        sx={{minWidth: 0}}
                                        onClick={() => props.onDelete(access)}
                                    >
                                        <DeleteIcon fontSize="small"/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}