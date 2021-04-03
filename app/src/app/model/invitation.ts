import { PersistentData } from './common';

export interface Invitation extends PersistentData {
    email: string;
    expirationDate: Date;
    sponsor: string;
}
