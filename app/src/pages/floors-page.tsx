import {Alert, AlertTitle, Box, Tab, Tabs} from "@mui/material";
import {useEffect, useReducer, useState} from "react";
import {Floor} from "../models/floor";
import {
    DeskBookingsApiService,
    DesksApiService,
    FloorApiService,
    RoomBookingsApiService,
    RoomsApiService
} from "../services/rest-api-service";
import {useAppDispatch, useAppSelector} from "../hooks";
import {addMessage, hideLoading, showLoading} from "../features/app";
import {FloorPlan} from "../components/floor-plan";
import {Calendar} from "../components/calendar";
import {FloorList} from "../components/floor-list";
import {Desk} from "../models/desk";
import {Room} from "../models/room";
import {DeskBooking} from "../models/desk-booking";
import {RoomBooking} from "../models/room-booking";

export function FloorsPage() {
    const dispatch = useAppDispatch();
    const userId = useAppSelector(state => state.user.userId);

    const [currentDate, setCurrentDate] = useState(new Date());

    const [floors, setFloors] = useState<Floor[]>();
    const [desks, setDesks] = useState<Desk[]>([]);
    const [desksBookings, setDeskBookings] = useState<DeskBooking[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [RoomBookings, setRoomBookings] = useState<RoomBooking[]>([]);

    const [currentFloorId, setCurrentFloorId] = useState<number>();
    const [showFloorPlan, toggleShowFloorPlan] = useReducer(p => !p, true);

    const currentFloor = (floors ?? []).find(fl => fl.id === currentFloorId);

    useEffect(() => {
        dispatch(showLoading());

        FloorApiService.list({accesses__user: userId ?? 0})
            .then(res => {
                setFloors(res.results);
                if (res.results.length > 0) {
                    setCurrentFloorId(res.results[0].id);
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
            DesksApiService.list({floor: currentFloorId.toString()})
                .then(res => setDesks(res.results));
            RoomsApiService.list({floor: currentFloorId.toString()})
                .then(res => setRooms(res.results));
        }
    }, [currentFloorId]);

    useEffect(() => {
        if (currentFloorId != null) {
            DeskBookingsApiService.list({
                floor: currentFloorId.toString(),
                date__year: currentDate.getFullYear().toString(),
                date__month: currentDate.getMonth().toString(),
                date__day: currentDate.getDate().toString(),
            })
                .then(res => setDeskBookings(res.results));
            RoomBookingsApiService.list({
                floor: currentFloorId.toString(),
                start__year: currentDate.getFullYear().toString(),
                start__month: currentDate.getMonth().toString(),
                start__day: currentDate.getDate().toString(),
            })
                .then(res => setRoomBookings(res.results));
        }
    }, [currentFloorId, currentDate]);

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
                    onChange={setCurrentDate}
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
                    onChange={(_, value) => setCurrentFloorId(value)}
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
                    height: 'calc(100vh - 560px)',
                }}
            >
                {
                    currentFloor != null &&
                    showFloorPlan &&
                    <FloorPlan
                        floor={currentFloor}
                        desks={desks}
                        rooms={rooms}
                        onSwitchLayout={toggleShowFloorPlan}
                    />
                }

                {
                    currentFloor != null &&
                    !showFloorPlan &&
                    <FloorList
                        floor={currentFloor}
                        desks={desks ?? []}
                        rooms={rooms ?? []}
                        onSwitchLayout={toggleShowFloorPlan}
                    />
                }
            </Box>
        </Box>
    );
}