export interface Seat {
    index: number;
    row: number;
    column: number;
    value: string;
    position?: string;
    icon: string | null;
    cursor: boolean;
}
