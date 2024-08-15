import {useAppDispatch, useAppSelector} from "../hooks";
import {Alert, AlertTitle, Snackbar} from "@mui/material";
import {removeMessage} from "../features/app";
import React from "react";

export function MessageBoard() {
    const dispatch = useAppDispatch();
    const messages = useAppSelector(state => state.app.messages);

    return (
        <>
            {
                messages.map(msg => (
                    <Snackbar
                        key={msg.id}
                        open={true}
                        autoHideDuration={5000}
                        onClose={() => dispatch(removeMessage(msg.id))}
                    >
                        <Alert
                            onClose={() => dispatch(removeMessage(msg.id))}
                            severity={msg.severity}
                            sx={{width: '100%'}}
                        >
                            <AlertTitle>{msg.title}</AlertTitle>
                            {msg.message}
                        </Alert>
                    </Snackbar>
                ))
            }
        </>
    );
}