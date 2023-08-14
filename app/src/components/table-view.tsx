import {
    Box, Button, IconButton,
    Paper, Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow, TextField, Tooltip,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import {DeleteOutline} from "@mui/icons-material";

interface TableViewProps<T> {
    label?: string;
    actions?: {
        label: string;
        onClick: () => void;
    }[];
    filterItem?: (item: T, search: string) => boolean;
    onDelete?: (item: T) => void;

    pagination?: {
        total: number;
        offset: number;
        size: number;
        onNextPage: () => void;
        onPreviousPage: () => void;
    };

    columLabels: string[];
    data?: T[];
    cellBuilder: (item: T) => React.ReactNode;
    getRowId: (item: T) => any;
}

export function TableView<T>(props: TableViewProps<T>) {
    const [search, setSearch] = useState('');

    const lowerCaseSearch = search.toLowerCase();
    const filteredData = props.data != null ?
        (
            props.filterItem != null ?
                props.data.filter(d => props.filterItem!(d, lowerCaseSearch)) :
                props.data
        ) :
        undefined;

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                }}
            >
                {
                    props.label != null &&
                    <Typography
                        variant="h5"
                        component="h1"
                    >
                        {props.label}
                    </Typography>
                }

                {
                    props.actions != null &&
                    <Box
                        sx={{ml: 'auto'}}
                    >
                        {
                            props.actions.map(act => (
                                <Button
                                    key={act.label}
                                    onClick={act.onClick}
                                    variant="contained"
                                >
                                    {act.label}
                                </Button>
                            ))
                        }
                    </Box>
                }
            </Box>

            {
                props.filterItem != null &&
                <Box
                    sx={{
                        mt: props.label != null || props.actions != null ? 4 : undefined,
                        mb: 2,
                    }}
                >
                    <TextField
                        fullWidth
                        variant="filled"
                        label="Suchen"
                        size="small"
                        value={search}
                        onChange={evt => setSearch(evt.target.value)}
                    />
                </Box>
            }

            <TableContainer
                component={Paper}
                sx={{
                    mt: props.filterItem == null && (props.label != null || props.actions != null) ? 4 : undefined,
                }}
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
                            {
                                props.columLabels.map(label => (
                                    <TableCell key={label}>
                                        {label}
                                    </TableCell>
                                ))
                            }
                            {
                                props.onDelete != null &&
                                <TableCell/>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            filteredData == null &&
                            <TableRow>
                                {
                                    props.columLabels.map(label => (
                                        <TableCell key={label}>
                                            <Skeleton variant="rectangular"/>
                                        </TableCell>
                                    ))
                                }
                                {
                                    props.onDelete != null &&
                                    <TableCell>
                                        <Skeleton variant="rectangular"/>
                                    </TableCell>
                                }
                            </TableRow>
                        }

                        {
                            filteredData != null &&
                            filteredData.length === 0 &&
                            <TableRow>
                                <TableCell>
                                    Keine Einträge gefunden
                                </TableCell>
                            </TableRow>
                        }

                        {
                            filteredData != null &&
                            filteredData.length > 0 &&
                            filteredData.map(item => (
                                <TableRow key={props.getRowId(item)}>
                                    {
                                        props.cellBuilder(item)
                                    }
                                    {
                                        props.onDelete != null &&
                                        <TableCell>
                                            <Tooltip title="Löschen">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => props.onDelete!(item)}
                                                >
                                                    <DeleteOutline/>
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>

                    {
                        props.pagination != null &&
                        <TableFooter>
                            TODO
                        </TableFooter>
                    }
                </Table>
            </TableContainer>
        </Box>
    );
}