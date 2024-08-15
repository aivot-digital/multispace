export interface Message {
    id: string;
    title: string;
    message: string;
    severity: 'error' | 'warning' | 'info' | 'success';
}
