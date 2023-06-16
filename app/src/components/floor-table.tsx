import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {Link} from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import {Floor} from "../models/floor";

interface FloorTableProps {
    floors: Floor[];

    onDelete: (floor: Floor) => void;
}

export function FloorTable(props: FloorTableProps) {
    return (
        <TableContainer
            component={Paper}
        >
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
                        <TableCell>Tische</TableCell>
                        <TableCell>Zugangsberechtigt</TableCell>
                        <TableCell/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.floors.map((floor) => (
                            <TableRow
                                key={floor.id}
                            >
                                <TableCell>
                                    <Link
                                        to={`/manage-floors/edit/${floor.id}`}
                                    >
                                        {floor.name}
                                    </Link>
                                </TableCell>

                                <TableCell>
                                    {floor.desk_count}
                                </TableCell>

                                <TableCell>
                                    {floor.access_count}
                                </TableCell>

                                <TableCell>
                                    <Button
                                        size="small"
                                        color="error"
                                        sx={{minWidth: 0}}
                                        onClick={() => props.onDelete(floor)}
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