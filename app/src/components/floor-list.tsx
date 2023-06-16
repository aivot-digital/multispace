import {Box, Button, List, ListItem, ListItemButton, ListItemText, Tooltip, Typography} from "@mui/material";
import {Floor} from "../models/floor";
import {Desk} from "../models/desk";
import {Room} from "../models/room";
import {Map} from "@mui/icons-material";


interface FloorListProps {
    floor: Floor;

    desks: Desk[];
    rooms: Room[];

    onSwitchLayout: () => void;
}

export function FloorList(props: FloorListProps) {
    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <Tooltip title="Karte anzeigen">
                    <Button
                        onClick={props.onSwitchLayout}
                        variant="contained"
                        size="small"
                        sx={{
                            minWidth: '0',
                        }}
                    >
                        <Map/>
                    </Button>
                </Tooltip>
            </Box>

            <Typography>
                Tische
            </Typography>
            <List>
                {
                    props.desks.map(desk => (
                        <ListItem key={desk.id}>
                            <ListItemButton>
                                <ListItemText>
                                    {desk.name}
                                </ListItemText>
                            </ListItemButton>
                        </ListItem>
                    ))
                }
            </List>

            <Typography>
                Räume
            </Typography>
            <List>
                {
                    props.rooms.map(room => (
                        <ListItem key={room.id}>
                            <ListItemButton>
                                <ListItemText>
                                    {room.name}
                                </ListItemText>
                            </ListItemButton>
                        </ListItem>
                    ))
                }
            </List>
        </Box>
    );
}