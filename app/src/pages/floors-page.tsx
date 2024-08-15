import {Alert, AlertTitle, Box, Tab, Tabs} from "@mui/material";
import {SyntheticEvent, useEffect, useState} from "react";
import {Floor} from "../models/floor";
import {
    DeskBookingsApiService,
    DesksApiService,
    FloorApiService,
    RoomBookingsApiService,
    RoomsApiService
} from "../services/rest-api-service";
import {useAppDispatch, useAppSelector} from "../hooks";
import {
    addMessage,
    hideLoading,
    selectCurrentDate,
    setCurrentDate,
    setCurrentFloor,
    setDisplayMode,
    showLoading
} from "../features/app";
import {FloorPlan} from "../components/floor-plan";
import {Calendar} from "../components/calendar";
import {FloorList} from "../components/floor-list";
import {Desk} from "../models/desk";
import {Room} from "../models/room";
import {DeskBookingWithUser} from "../models/desk-booking";
import {RoomBookingWithUser} from "../models/room-booking";
import {useNavigate} from "react-router-dom";

export function FloorsPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const userId = useAppSelector(state => state.user.userId);

    const currentDate = useAppSelector(selectCurrentDate);
    const displayMode = useAppSelector(state => state.app.displayMode);
    const currentFloorId = useAppSelector(state => state.app.currentFloor);

    const [floors, setFloors] = useState<Floor[]>();
    const [desks, setDesks] = useState<Desk[]>([]);
    const [desksBookings, setDeskBookings] = useState<DeskBookingWithUser[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomBookings, setRoomBookings] = useState<RoomBookingWithUser[]>([]);

    const currentFloor = (floors ?? []).find(fl => fl.id === currentFloorId);


    useEffect(() => {
        dispatch(showLoading());

        FloorApiService.list({accesses__user: userId ?? 0})
            .then(res => {
                setFloors(res.results);
                if (res.results.length > 0) {
                    if (currentFloorId == null || !res.results.some(f => f.id === currentFloorId)) {
                        dispatch(setCurrentFloor(res.results[0].id));
                    }
                }
            })
            .catch(err => {
                console.error(err);
                dispatch(addMessage({
                    id: 'failed_to_load_floors',
                    title: 'Bereiche konnten nicht geladen werden',
                    message: 'Die Bereiche konnten nicht geladen werden. Probieren Sie es später erneut.',
                    severity: 'error',
                }))
            })
            .finally(() => {
                dispatch(hideLoading());
            });
    }, []);

    useEffect(() => {
        if (currentFloorId != null) {
            DesksApiService
                .list({floor: currentFloorId})
                .then(res => res.results)
                .then(setDesks);

            RoomsApiService
                .list({floor: currentFloorId})
                .then(res => res.results)
                .then(setRooms);
        }
    }, [currentFloorId]);

    useEffect(() => {
        if (currentFloorId != null) {
            DeskBookingsApiService
                .listWithUsers({
                    floor: currentFloorId.toString(),
                    date__gte: currentDate.toISOString(),
                    date__lte: currentDate.toISOString(),
                })
                .then(setDeskBookings);

            RoomBookingsApiService
                .listWithUsers({
                    floor: currentFloorId.toString(),
                    start__gte: new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate(),
                        0, 0, 0, 0,
                    ).toISOString(),
                    start__lte: new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate(),
                        23, 59, 59, 999,
                    ).toISOString(),
                })
                .then(setRoomBookings);
        }
    }, [currentFloorId, currentDate]);


    const handleSelectFloor = (floorId: number) => {
        dispatch(setCurrentFloor(floorId));
    };

    const handleToggleShowFloorPlan = () => {
        dispatch(setDisplayMode(displayMode === 'map' ? 'list' : 'map'))
    };

    const handleSetCurrentDate = (date: Date) => {
        dispatch(setCurrentDate(date.toISOString()));
    };

    if (floors == null) {
        return null;
    }

    if (floors.length === 0) {
        return (
            <Box>
                <Alert severity="info">
                    <AlertTitle>Keine Bereiche zugänglich</AlertTitle>
                    Es existieren noch keine Bereiche, zu denen Sie Zugang haben.
                    Lassen Sie sich von einem Administrator zu den notwendigen Bereichen hinzufügen.
                </Alert>
            </Box>
        );
    }

    return (
        <Box>
            <Box>
                <Calendar
                    value={currentDate}
                    onChange={handleSetCurrentDate}
                    paperProps={{sx: {mb: 3}}}
                />
            </Box>

            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                <Tabs
                    value={currentFloorId}
                    onChange={(_: SyntheticEvent, value: number) => handleSelectFloor(value)}
                >
                    {
                        floors.map(floor => (
                            <Tab
                                key={floor.id}
                                value={floor.id}
                                label={floor.name}
                            />
                        ))
                    }
                </Tabs>
            </Box>

            <Box
                sx={{
                    mt: 4,
                    height: '100vh',
                }}
            >
                {
                    currentFloor != null &&
                    displayMode === 'map' &&
                    <FloorPlan
                        floor={currentFloor}
                        desks={desks}
                        rooms={rooms}
                        deskBookings={desksBookings}
                        roomBookings={roomBookings}
                        onSwitchLayout={handleToggleShowFloorPlan}
                        onDeskClick={desk => navigate(`/desks/${desk.id}`)}
                        onRoomClick={room => navigate(`/rooms/${room.id}`)}
                    />
                }

                {
                    currentFloor != null &&
                    displayMode === 'list' &&
                    <FloorList
                        floor={currentFloor}
                        desks={desks ?? []}
                        rooms={rooms ?? []}
                        deskBookings={desksBookings}
                        roomBookings={roomBookings}
                        onSwitchLayout={handleToggleShowFloorPlan}
                        onDeskClick={desk => navigate(`/desks/${desk.id}`)}
                        onRoomClick={room => navigate(`/rooms/${room.id}`)}
                    />
                }
            </Box>
        </Box>
    );
}