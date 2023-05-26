import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Message} from "../models/message";

interface AppState {
    showLoading: boolean;
    messages: Message[];
}

const initialState: AppState = {
    showLoading: false,
    messages: [],
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
            state.messages = [
                ...state.messages,
                action.payload,
            ];
        },
        removeMessage: (state, action: PayloadAction<string>) => {
            state.messages = state.messages.filter(ms => ms.id !== action.payload);
        },
    },
});

export const {
    showLoading,
    hideLoading,
    addMessage,
    removeMessage,
} = appSlice.actions;

export const appReducer = appSlice.reducer;
