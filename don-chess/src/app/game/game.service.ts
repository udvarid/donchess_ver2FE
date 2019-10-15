import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChessGameDto } from '../shared/dto/chessGameDto.model';
import { Subject } from 'rxjs';
import { ChessTableDto } from '../shared/dto/chessTableDto.model';
import { ValidMovesDto } from '../shared/dto/validMovesDto.model';
import { Cell } from '../shared/chessTable.model';
import { ChessMoveDto } from '../shared/dto/chessMoveDto.model';

@Injectable({ providedIn: 'root' })

export class GameService {

    private games: ChessGameDto[] = [];
    private gameSelected: ChessTableDto;
    private gameValidMoves: ValidMovesDto;
    private selectedCell: Cell = null;
    gamesChanged = new Subject<ChessGameDto[]>();
    gameSelectedChange = new Subject<ChessTableDto>();
    gameValidMovesChange = new Subject<ValidMovesDto>();

    constructor(private http: HttpClient, private router: Router) {}

    getGameList() {
        const header = new HttpHeaders({});
        this.http.get('api/game/list', {headers: header}).subscribe((response: ChessGameDto[]) => {
            this.games = response;
            this.gamesChanged.next(response);
        });
    }

    getGameSelected(index: number) {
        const header = new HttpHeaders({});
        this.http.get('api/game/' + index, {headers: header}).subscribe((response: ChessTableDto) => {
            this.gameSelected = response;
            this.gameSelectedChange.next(response);
        });
    }

    getGameValidMoves(index: number) {
        const header = new HttpHeaders({});
        this.http.get('api/game/validMoves/' + index, {headers: header}).subscribe((response: ValidMovesDto) => {
            this.gameValidMoves = response;
            this.gameValidMovesChange.next(response);
        });
    }

    makeMove(move: ChessMoveDto) {
        const header = new HttpHeaders({});
        this.http.post('api/game/move', move, {headers: header}).subscribe(() => {
            console.log('Valid move happened');
            console.log(move);
        });
    }

    clickOnCell(clickedCell: Cell) {
        if (clickedCell.targets.length > 0) {
            this.selectedCell = clickedCell;
            console.log('Selected cell has been changed');
            console.log(this.selectedCell);
            return;
        }
        if (this.selectedCell === null) {
            console.log('There is no valid moves');
            return;
        }
        if (this.selectedCell.targets.find(cell =>
            cell.coordX === clickedCell.coordX && cell.coordY === clickedCell.coordY
        )) {
            // TODO promotion asking in case of Pawn
            const move: ChessMoveDto = {
                gameId: this.gameSelected.chessGameId,
                moveId: this.gameSelected.lastMoveId + 1,
                moveFromX: this.selectedCell.coordY + 1,
                moveFromY: this.selectedCell.coordX + 1,
                moveToX: clickedCell.coordY + 1,
                moveToY: clickedCell.coordX + 1,
                promoteToFigure: ''
            };
            this.makeMove(move);
        }
        console.log('Selected cell has been unselected');
        this.selectedCell = null;


    }

}
