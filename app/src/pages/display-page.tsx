import {useEffect, useState} from "react";
import {FloorApiService} from "../services/rest-api-service";
import {DisplayFloor} from "../models/floor";
import {FloorPlan} from "../components/floor-plan";
import {Box, Container, Typography} from "@mui/material";

export function DisplayPage({displayKey}: { displayKey: string }) {
    const [floor, setFloor] = useState<DisplayFloor>();

    useEffect(() => {
        FloorApiService
            .getDisplayFloor(displayKey)
            .then(setFloor);

        const intervalId = setInterval(() => {
            FloorApiService
                .getDisplayFloor(displayKey)
                .then(setFloor);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [displayKey]);

    if (floor == null) {
        return (
            <Container>
                <Typography>
                    Lade Daten...
                </Typography>
            </Container>
        );
    }

    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
            }}
        >
            <FloorPlan
                floor={floor}
                desks={floor.desks}
                rooms={floor.rooms}
            />
        </Box>
    );
}