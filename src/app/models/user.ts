export interface User {
    uid: string;
    name: string;
    email: string;
    phone: string;
    code?: string;
    timestamp?: string;
    emailVerified?: boolean;
 }