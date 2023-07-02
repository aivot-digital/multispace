import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Message} from "../models/message";
import {parseISO} from "date-fns";
import {RootState} from "../store";

interface AppState {
    showLoading: boolean;
    messages: Message[];

    currentDate: string;
    currentFloor?: number;
    displayMode: 'map' | 'list';
    calendarMinimized: boolean;
    dayPlanMinimized: boolean;
}

const initialState: AppState = {
    showLoading: false,
    messages: [],
    currentDate: new Date().toISOString(),
    displayMode: 'map',
    calendarMinimized: false,
    dayPlanMinimized: false,
};

export const appSlice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        showLoading: (state) => {
            state.showLoading = true;
        },
        hideLoading: (state) => {
            state.showLoading = false;
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            if (state.messages.some(m => m.id === action.payload.id)) {
                return;
            }

            state.messages = [
                ...state.messages,
                action.payload,
            ];
        },
        removeMessage: (state, action: PayloadAction<string>) => {
            state.messages = state.messages.filter(ms => ms.id !== action.payload);
        },

        setCurrentDate: (state, action: PayloadAction<string>) => {
            state.currentDate = action.payload;
        },

        setDisplayMode: (state, action: PayloadAction<'map' | 'list'>) => {
            state.displayMode = action.payload;
        },

        setCurrentFloor: (state, action: PayloadAction<number>) => {
            state.currentFloor = action.payload;
        },

        toggleCalendarMinimized: (state) => {
            state.calendarMinimized = !state.calendarMinimized;
        },
        toggleDayPlanMinimized: (state) => {
            state.dayPlanMinimized = !state.dayPlanMinimized;
        },
    },
});

export const {
    showLoading,
    hideLoading,
    addMessage,
    removeMessage,
    setCurrentDate,
    setCurrentFloor,
    setDisplayMode,
    toggleCalendarMinimized,
    toggleDayPlanMinimized,
} = appSlice.actions;

export const selectCurrentDate = (state: RootState) => parseISO(state.app.currentDate);

export const appReducer = appSlice.reducer;
