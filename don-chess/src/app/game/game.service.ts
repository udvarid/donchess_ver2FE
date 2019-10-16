import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChessGameDto } from '../shared/dto/chessGameDto.model';
import { Subject } from 'rxjs';
import { ChessTableDto } from '../shared/dto/chessTableDto.model';
import { ValidMovesDto } from '../shared/dto/validMovesDto.model';
import { Cell, CellTarget } from '../shared/chessTable.model';
import { ChessMoveDto } from '../shared/dto/chessMoveDto.model';
import { FigureDto } from '../shared/dto/figureDto.model';
import { Color, PromoteType, ChessFigure } from '../shared/enums/enums.model';
import { CoordinateDto } from '../shared/dto/coordinateDto.model';

@Injectable({ providedIn: 'root' })

export class GameService {

    private games: ChessGameDto[] = [];
    private gameSelected: ChessTableDto;
    private gameValidMoves: ValidMovesDto;
    private selectedCell: Cell = null;
    private table: Cell[][] = [];
    private promotedFigure: PromoteType = PromoteType.Queen;
    gamesChanged = new Subject<ChessGameDto[]>();
    gameSelectedChange = new Subject<ChessTableDto>();
    gameValidMovesChange = new Subject<ValidMovesDto>();
    chessTableChanged = new Subject<Cell[][]>();

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
            this.getGameValidMoves(index);
        });
    }

    getGameValidMoves(index: number) {
        const header = new HttpHeaders({});
        this.http.get('api/game/validMoves/' + index, {headers: header}).subscribe((response: ValidMovesDto) => {
            this.gameValidMoves = response;
            this.gameValidMovesChange.next(response);
            this.createTable();
        });
    }

    makeMove(move: ChessMoveDto) {
        const header = new HttpHeaders({});
        this.http.post('api/game/move', move, {headers: header}).subscribe(() => {
            console.log('Valid move happened');
            console.log(move);
            this.getGameSelected(this.gameSelected.chessGameId);
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
                promoteToFigure: this.canBePromoted(clickedCell) ? this.promotedFigure : ''
            };
            this.makeMove(move);
        }
        console.log('Selected cell has been unselected');
        this.selectedCell = null;
    }

    canBePromoted(clickedCell: Cell): boolean {
        if (this.selectedCell.chessFigure === ChessFigure.Pawn) {
            if (this.selectedCell.chessFigureColor === Color.White && clickedCell.coordX === 7 ||
                this.selectedCell.chessFigureColor === Color.Black && clickedCell.coordX === 0) {
                return true;
            }
        }
        return false;
    }

    createTable() {
        for (let i = 0; i < 8; i++) {
          this.table[i] = [];
          for (let j = 0; j < 8; j++) {
            const figure: FigureDto = this.getFigure(7 - i + 1, j + 1);
            const targets: CellTarget[] = this.getTargets(7 - i + 1, j + 1);
            this.table[i][j] = {
              coordX: 7 - i,
              coordY: j,
              color: (7 - i + j) % 2 === 0 ? Color.Black : Color.White,
              chessFigure: figure ? figure.figureType : null,
              chessFigureColor: figure ? figure.color : null,
              targets: targets ? targets : null
            };
          }
        }
        this.chessTableChanged.next(this.table);
      }

      getFigure(row: number, column: number): FigureDto {
          const figure: FigureDto = this.gameSelected.figures.find(fig => fig.coordX === column && fig.coordY === row);
          return figure;
      }

      getTargets(row: number, column: number): CellTarget[] {
        const coordinates: CoordinateDto[] =
            this.gameValidMoves.validMoves.filter(target => target.fromX === column && target.fromY === row);

        const targets: CellTarget[] = coordinates.map(coord => {
          const target: CellTarget = {
            coordX: coord.toY - 1,
            coordY: coord.toX - 1
          };
          return target;
        });

        return targets;
      }

}
