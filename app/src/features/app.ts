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
    currentDate: localStorage.getItem('currentDate') ?? new Date().toISOString(),
    displayMode: (localStorage.getItem('displayMode') ?? 'map') as ('map' | 'list'),
    calendarMinimized: localStorage.getItem('calendarMinimized') === 'yes',
    dayPlanMinimized: localStorage.getItem('dayPlanMinimized') === 'yes',
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

            localStorage.setItem('currentDate', action.payload);
        },

        setDisplayMode: (state, action: PayloadAction<'map' | 'list'>) => {
            state.displayMode = action.payload;

            localStorage.setItem('displayMode', action.payload);
        },

        setCurrentFloor: (state, action: PayloadAction<number>) => {
            state.currentFloor = action.payload;

            localStorage.setItem('currentFloor', action.payload.toString());
        },

        toggleCalendarMinimized: (state) => {
            state.calendarMinimized = !state.calendarMinimized;

            localStorage.setItem('calendarMinimized', state.calendarMinimized ? 'yes' : 'no');
        },
        toggleDayPlanMinimized: (state) => {
            state.dayPlanMinimized = !state.dayPlanMinimized;

            localStorage.setItem('dayPlanMinimized', state.dayPlanMinimized ? 'yes' : 'no');
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
