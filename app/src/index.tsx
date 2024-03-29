import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './app';
import {Provider} from 'react-redux';
import reportWebVitals from './reportWebVitals';
import {store} from "./store";
import {CssBaseline} from "@mui/material";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './index.css';
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers";
import de from "date-fns/locale/de";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <CssBaseline/>
        <Provider store={store}>
            <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={de}
            >
                <App/>
            </LocalizationProvider>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
