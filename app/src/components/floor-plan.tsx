import {Image, Layer, Rect, Stage, Text, Transformer} from "react-konva";
import {Box, Button, Tooltip, useTheme} from "@mui/material";
import {Floor} from "../models/floor";
import {useCallback, useEffect, useReducer, useRef, useState} from "react";
import {AddBox, AddToQueue, List} from '@mui/icons-material';
import {Desk, isDisplayDesk} from "../models/desk";
import {isDisplayRoom, Room} from "../models/room";
import {KonvaEventObject} from "konva/lib/Node";
import {DeskBookingWithUser} from "../models/desk-booking";
import {RoomBookingWithUser} from "../models/room-booking";
import {format, parseISO} from "date-fns";

interface FloorPlanProps {
    floor: Floor;

    desks?: Desk[];
    rooms?: Room[];

    deskBookings?: DeskBookingWithUser[];
    roomBookings?: RoomBookingWithUser[];

    onSwitchLayout?: () => void;

    onDeskClick?: (desk: Desk) => void;
    onRoomClick?: (room: Room) => void;

    onAddDesk?: () => void;
    onChangeDesks?: (desks: Desk[]) => void;
    onAddRoom?: () => void;
    onChangeRooms?: (rooms: Room[]) => void;
}

export function FloorPlan(props: FloorPlanProps) {
    const theme = useTheme();

    const containerRef = useRef<HTMLDivElement>();
    const stageRef = useRef<any>();

    const [image, setImage] = useState<HTMLImageElement>();
    const [containerWidth, setContainerWidth] = useState<number>(200);
    const [containerHeight, setContainerHeight] = useState<number>(100);

    const containerMountHandler = useCallback((node: any) => {
        if (node !== null) {
            setContainerWidth(node.getBoundingClientRect().width);
            setContainerHeight(node.getBoundingClientRect().height);
            containerRef.current = node;
        }
    }, []);

    useEffect(() => {
        const setSize = () => {
            const container = containerRef.current;
            if (container != null) {
                setContainerWidth(container.getBoundingClientRect().width);
                setContainerHeight(container.getBoundingClientRect().height);
            }
        };
        window.addEventListener('resize', setSize);
        return () => window.removeEventListener('resize', setSize);
    }, []);

    useEffect(() => {
        const img = new window.Image();
        img.addEventListener('load', () => {
            setImage(img);
        });
        img.src = props.floor.image;
    }, [props.floor.image]);

    if (image == null) {
        return null;
    }

    const widthRatio = containerWidth / image.width;
    const heightRatio = containerHeight / image.height;
    const bestRatio = Math.min(widthRatio, heightRatio);

    const offsetX = -((containerWidth - (image.width * bestRatio)) / 2);
    const offsetY = -((containerHeight - (image.height * bestRatio)) / 2);

    return (
        <Box
            ref={containerMountHandler}
            sx={{
                position: 'relative',
                height: '100%',
                width: '100%',
                background: '#f0f0f0',
            }}
        >
            <Stage
                ref={stageRef}
                width={containerWidth}
                height={containerHeight}
                scaleX={bestRatio}
                scaleY={bestRatio}
                offsetX={offsetX}
                offsetY={offsetY}
            >
                <Layer>
                    <Image
                        image={image}
                    />
                </Layer>

                {
                    props.rooms != null &&
                    <Layer>
                        {
                            props.rooms.map(room => {
                                const bookings = (props.roomBookings ?? []).filter(bk => bk.room === room.id);
                                return (
                                    <ItemRect
                                        key={room.id}
                                        item={room}
                                        color={bookings.length > 0 || (isDisplayRoom(room) && room.is_blocked) ? theme.palette.warning.main : theme.palette.info.main}
                                        onClick={props.onRoomClick}
                                        onChange={props.onChangeRooms != null ? (updatedRoom) => {
                                            props.onChangeRooms!((props.rooms ?? []).map(d => d === room ? updatedRoom : d));
                                        } : undefined}
                                        subtext={bookings.length > 0 ? '\n' + bookings.map(bk => `${format(parseISO(bk.start), 'HH:mm')} - ${format(parseISO(bk.end), 'HH:mm')}`).join('\n') : undefined}
                                    />
                                );
                            })
                        }
                    </Layer>
                }

                {
                    props.desks != null &&
                    <Layer>
                        {
                            props.desks.map(desk => {
                                const booking = (props.deskBookings ?? []).find(bk => bk.desk === desk.id);
                                return (
                                    <ItemRect
                                        key={desk.id}
                                        item={desk}
                                        color={booking != null || (isDisplayDesk(desk) && desk.is_blocked) ? theme.palette.warning.main : theme.palette.info.main}
                                        onClick={props.onDeskClick}
                                        onChange={props.onChangeDesks != null ? (updatedDesk) => {
                                            props.onChangeDesks!((props.desks ?? []).map(d => d === desk ? updatedDesk : d));
                                        } : undefined}
                                        subtext={booking != null ? booking.user.username : undefined}
                                    />
                                );
                            })
                        }
                    </Layer>
                }
            </Stage>

            <Box sx={{position: 'absolute', top: '0.5em', right: '0.5em'}}>
                {
                    props.onSwitchLayout != null &&
                    <Tooltip title="Als Liste anzeigen">
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                minWidth: '0',
                                ml: 1,
                            }}
                            onClick={props.onSwitchLayout}
                        >
                            <List/>
                        </Button>
                    </Tooltip>
                }

                {
                    props.onAddDesk != null &&
                    <Tooltip title="Neuen Tisch hinzufügen">
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                minWidth: '0',
                                ml: 1,
                            }}
                            onClick={props.onAddDesk}
                        >
                            <AddToQueue/>
                        </Button>
                    </Tooltip>
                }

                {
                    props.onAddRoom != null &&
                    <Tooltip title="Neuen Raum hinzufügen">
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                minWidth: '0',
                                ml: 1,
                            }}
                            onClick={props.onAddRoom}
                        >
                            <AddBox/>
                        </Button>
                    </Tooltip>
                }
            </Box>
        </Box>
    );
}

interface ItemRectProps<T> {
    item: T;
    color: string;
    onClick?: (item: T) => void;
    onChange?: (item: T) => void;
    subtext?: string;
}

function ItemRect<T extends Desk | Room>(props: ItemRectProps<T>) {
    const [isHovered, toggleHovered] = useReducer(p => !p, false);

    const shapeRef = useRef<any>();
    const trRef = useRef<any>();

    useEffect(() => {
        if (trRef.current != null) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, []);

    const handleClick = () => {
        if (props.onClick != null) {
            props.onClick(props.item);
        }
    };

    const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
        if (props.onChange != null) {
            props.onChange({
                ...props.item,
                pos_x: e.target.x(),
                pos_y: e.target.y(),
            });
        }
    };

    const handleTransformEnd = (_: KonvaEventObject<Event>) => {
        if (props.onChange != null) {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleY(1);
            node.scaleX(1);

            props.onChange({
                ...props.item,
                width: Math.max(64, node.width() * scaleX),
                height: Math.max(64, node.height() * scaleY),
                pos_x: node.getX(),
                pos_y: node.getY(),
                orientation: node.rotation(),
            });
        }
    };

    return (
        <>
            <Rect
                ref={shapeRef}
                onTransformEnd={props.onChange != null ? handleTransformEnd : undefined}

                width={props.item.width}
                height={props.item.height}

                fill={props.color}
                opacity={isHovered ? 0.25 : 0.5}
                rotation={props.item.orientation}

                x={props.item.pos_x}
                y={props.item.pos_y}

                onClick={handleClick}
                onTap={handleClick}

                onMouseEnter={toggleHovered}
                onMouseLeave={toggleHovered}

                draggable={props.onChange != null}
                onDragEnd={props.onChange != null ? handleDragEnd : undefined}
            />

            <Text
                text={props.item.name + (props.subtext != null ? `\n${props.subtext}` : '')}
                align="center"
                verticalAlign="middle"
                fontSize={22}
                listening={false}

                x={props.item.pos_x}
                y={props.item.pos_y}

                width={props.item.width}
                height={props.item.height}
                rotation={props.item.orientation}
            />

            {
                props.onChange != null &&
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            }
        </>
    );
}

