import { configureStore } from '@reduxjs/toolkit'
import {systemConfigReducer} from "./features/system-config";
import {userReducer} from "./features/user";
import {appReducer} from "./features/app";

export const store = configureStore({
    reducer: {
        app: appReducer,
        user: userReducer,
        systemConfig: systemConfigReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
