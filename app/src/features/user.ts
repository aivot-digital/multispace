import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {User} from "../models/user";
import {ApiService} from "../services/api-service";
import {Credentials} from "../models/credentials";
import {AuthData} from "../models/auth_data";
import {UserApiService, UserConfigApiService} from "../services/rest-api-service";
import {RootState} from "../store";

interface UserState {
    user?: User;
    userId?: number;
    token?: string;
    config?: {
        [key: string]: string;
    };
}

const initialState: UserState = {
    token: localStorage.getItem('token') ?? undefined,
    userId: localStorage.getItem('userId') != null ? parseInt(localStorage.getItem('userId')!) : undefined,
};

export const fetchUser = createAsyncThunk('user/fetchUser', async (payload: number) => {
    return await UserApiService.retrieve(payload);
});

export const fetchUserConfig = createAsyncThunk('user/fetchUserConfig', async () => {
    const response = await UserConfigApiService.list();
    return response.results.reduce((acc, conf) => ({
        ...acc,
        [conf.key]: conf.value,
    }), {});
});

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        authenticate: (state, action: PayloadAction<AuthData>) => {
            state.userId = action.payload.user_id;
            state.token = action.payload.token;
            state.user = undefined;

            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('userId', action.payload.user_id.toString());
        },

        logout: (state) => {
            state.userId = undefined;
            state.user = undefined;
            state.token = undefined;

            localStorage.removeItem('token');
            localStorage.removeItem('userId');
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.userId = undefined;
                state.token = undefined;
                state.user = undefined;

                localStorage.removeItem('token');
                localStorage.removeItem('userId');
            })

            .addCase(fetchUserConfig.fulfilled, (state, action) => {
                state.config = action.payload;
            })
            .addCase(fetchUserConfig.rejected, (state, action) => {
                state.config = {};
            });
    },
});

export const {
    logout,
    authenticate,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
