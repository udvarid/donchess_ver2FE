import { Color, ChessFigure } from './enums/enums.model';

export interface Cell {
    coordX: number;
    coordY: number;
    color: Color;
    chessFigure?: ChessFigure;
    chessFigureColor?: Color;
    targets?: CellTarget[];
}

export interface CellTarget {
    coordX: number;
    coordY: number;
}
