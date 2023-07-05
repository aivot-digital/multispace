import {useEffect, useState} from "react";
import {FloorApiService} from "../services/rest-api-service";
import {DisplayFloor} from "../models/floor";
import {FloorPlan} from "../components/floor-plan";
import {Box, Container, Paper, Typography} from "@mui/material";
import {format} from "date-fns";
import {DisplayKey} from "../models/display-key";
import {FloorList} from "../components/floor-list";

function fetchFloor(displayKey: string): Promise<{ display: DisplayKey, floor: DisplayFloor }> {
    return FloorApiService
        .getDisplayFloor(displayKey)
        .then(({display, floor}) => ({
            display: display,
            floor: {
                ...floor,
                image: process.env.NODE_ENV === 'production' ? floor.image : `http://127.0.0.1:8000/${floor.image}`,
            }
        }));
}

export function DisplayPage({displayKey}: { displayKey: string }) {
    const [display, setDisplay] = useState<DisplayKey>();
    const [floor, setFloor] = useState<DisplayFloor>();

    useEffect(() => {
        fetchFloor(displayKey)
            .then(({display, floor}) => {
                setDisplay(display);
                setFloor(floor);
            });

        const intervalId = setInterval(() => {
            fetchFloor(displayKey)
                .then(({display, floor}) => {
                    setDisplay(display);
                    setFloor(floor);
                });
        }, 5000);

        return () => clearInterval(intervalId);
    }, [displayKey]);

    if (floor == null || display == null) {
        return (
            <Container>
                <Typography>
                    Lade Daten...
                </Typography>
            </Container>
        );
    }

    if (display.list_view) {
        return (
            <Box
                sx={{
                    width: '100vw',
                    height: '100vh',
                    px: 4,
                    py: 8,
                }}
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '1em',
                        right: '1em',
                        px: 1,
                        py: 0.5,
                    }}
                >
                    {format(new Date(), 'HH:mm - dd.MM.yyyy')}
                </Paper>

                <FloorList
                    floor={floor}
                    desks={floor.desks}
                    rooms={floor.rooms}
                />
            </Box>
        );
    } else {
        return (
            <Box
                sx={{
                    width: '100vw',
                    height: '100vh',
                    position: 'relative',
                }}
            >
                <FloorPlan
                    floor={floor}
                    desks={floor.desks}
                    rooms={floor.rooms}
                />

                <Paper
                    sx={{
                        position: 'absolute',
                        top: '1em',
                        right: '1em',
                        px: 1,
                        py: 0.5,
                    }}
                >
                    {format(new Date(), 'HH:mm - dd.MM.yyyy')}
                </Paper>
            </Box>
        );
    }
}