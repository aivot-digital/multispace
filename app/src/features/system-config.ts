import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {SystemConfigApiService} from "../services/rest-api-service";
import {RootState} from "../store";

interface SystemConfigState {
    values: {
        [key: string]: string;
    };
}

const initialState: SystemConfigState = {
    values: {},
};

export const fetchSystemConfig = createAsyncThunk('system-config/fetchSystemConfig', async () => {
    const response = await SystemConfigApiService.list(0, 999);
    return response.results.reduce((acc, conf) => ({
        ...acc,
        [conf.key]: conf.value,
    }), {});
});

export const systemConfigSlice = createSlice({
    name: 'system-config',
    initialState: initialState,
    reducers: {
        setSystemConfig: (state, action: PayloadAction<{key: string, value: string}>) => {
            const {key, value} = action.payload;
            state.values[key] = value;

            SystemConfigApiService.patch(key, {value})
                .catch(err => {
                    if (err.status === 404) {
                        SystemConfigApiService.create({key, value});
                    }
                });
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchSystemConfig.fulfilled, (state, action) => {
                state.values = action.payload;
            })
            .addCase(fetchSystemConfig.rejected, (state, action) => {
                state.values = {};
            });
    },
});

export const {
    setSystemConfig,
} = systemConfigSlice.actions;

export const selectSystemConfig = (key: string, def?: string) => (state: RootState) => state.systemConfig.values[key] ?? def;

export const systemConfigReducer = systemConfigSlice.reducer;
