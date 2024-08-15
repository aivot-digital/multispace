import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle} from "@mui/material";

interface ConfirmDialogProps {
    title: string;
    positiveLabel?: string;
    negativeLabel?: string;

    onClose: () => void;
    onPositive: () => void;
}

export function ConfirmDialog(props: React.PropsWithChildren<ConfirmDialogProps> & DialogProps) {
    const {
        title,
        children,
        positiveLabel,
        negativeLabel,
        onPositive,
        ...dialogProps
    } = props;

    return (
        <Dialog
            {...dialogProps}
        >
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {children}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onPositive}>
                    {positiveLabel ?? 'Ja'}
                </Button>
                <Button
                    onClick={dialogProps.onClose}
                    autoFocus
                >
                    {negativeLabel ?? 'Nein'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
