import React, {SyntheticEvent, useEffect, useState} from "react";
import {Box, Tab, Tabs, Typography} from "@mui/material";
import {Floor} from "../models/floor";
import {FloorApiService} from "../services/rest-api-service";
import {useParams} from "react-router-dom";
import {ManageFloorsEditPageTabCommon} from "./manage-floors-edit-page-tab-common";
import {ManageFloorsEditPageTabDesks} from "./manage-floors-edit-page-tab-desks";
import {ManageFloorsEditPageTabRooms} from "./manage-floors-edit-page-tab-rooms";
import {ManageFloorsEditPageTabAccess} from "./manage-floors-edit-page-tab-access";
import {ManageFloorsEditPageTabDisplays} from "./manage-floors-edit-page-tab-displays";


export function ManageFloorsEditPage() {
    const {id} = useParams();

    const [currentTab, setCurrentTab] = useState<number>(0);
    const [floor, setFloor] = useState<Floor>();

    useEffect(() => {
        if (id != null) {
            FloorApiService.retrieve(id)
                .then(res => setFloor(res));
        } else {
            setFloor({
                id: 0,
                name: '',
                image: '',
            });
        }
    }, [id]);

    return (
        <Box>
            <Typography
                variant="h5"
                component="h1"
            >
                Bereich {floor?.name ?? ''}
            </Typography>

            <Box
                sx={{
                    mt: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                <Tabs
                    value={currentTab}
                    onChange={(_: SyntheticEvent, val: number) => setCurrentTab(val)}
                >
                    <Tab
                        value={0}
                        label="Allgemein"
                    />
                    {
                        floor != null &&
                        floor.id !== 0 &&
                        <Tab
                            value={1}
                            label="Tische"
                        />
                    }
                    {
                        floor != null &&
                        floor.id !== 0 &&
                        <Tab
                            value={2}
                            label="Räume"
                        />
                    }
                    {
                        floor != null &&
                        floor.id !== 0 &&
                        <Tab
                            value={3}
                            label="Zugänge"
                        />
                    }
                    {
                        floor != null &&
                        floor.id !== 0 &&
                        <Tab
                            value={4}
                            label="Anzeigen"
                        />
                    }
                </Tabs>
            </Box>

            {
                floor != null &&
                <Box sx={{mt: 4}}>
                    {
                        currentTab === 0 &&
                        <ManageFloorsEditPageTabCommon
                            floor={floor}
                            onChange={setFloor}
                        />
                    }

                    {
                        currentTab === 1 &&
                        floor.id !== 0 &&
                        <ManageFloorsEditPageTabDesks
                            floor={floor}
                        />
                    }

                    {
                        currentTab === 2 &&
                        floor.id !== 0 &&
                        <ManageFloorsEditPageTabRooms
                            floor={floor}
                        />
                    }

                    {
                        currentTab === 3 &&
                        floor.id !== 0 &&
                        <ManageFloorsEditPageTabAccess
                            floor={floor}
                        />
                    }

                    {
                        currentTab === 4 &&
                        floor.id !== 0 &&
                        <ManageFloorsEditPageTabDisplays
                            floor={floor}
                        />
                    }
                </Box>
            }
        </Box>
    );
}
