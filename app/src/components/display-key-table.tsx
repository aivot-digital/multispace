import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import {DisplayKey} from "../models/display-key";

interface DisplayKeyTableProps {
    displayKeys: DisplayKey[];
    onDelete: (key: DisplayKey) => void;
}

export function DisplayKeyTable(props: DisplayKeyTableProps) {
    return (
        <TableContainer component={Paper}>
            <Table
                sx={{
                    '& tbody tr:last-child td': {
                        borderBottom: "none",
                    },
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell>Titel</TableCell>
                        <TableCell>Link</TableCell>
                        <TableCell/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.displayKeys.map((displayKey) => (
                            <TableRow
                                key={displayKey.id}
                            >
                                <TableCell>
                                    {displayKey.title}
                                </TableCell>

                                <TableCell>
                                    <a href={``}>{displayKey.id}</a>
                                </TableCell>

                                <TableCell>
                                    <Button
                                        size="small"
                                        color="error"
                                        sx={{minWidth: 0}}
                                        onClick={() => props.onDelete(displayKey)}
                                    >
                                        <DeleteIcon fontSize="small"/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}