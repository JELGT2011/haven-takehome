import { Timestamp } from 'firebase/firestore';

export interface Query {
    query: string;
    created: Timestamp;
}
