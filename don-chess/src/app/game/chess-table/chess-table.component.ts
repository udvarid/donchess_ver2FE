import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ChessTableDto } from 'src/app/shared/dto/chessTableDto.model';
import { GameService } from '../game.service';
import { Subscription } from 'rxjs';
import { ValidMovesDto } from 'src/app/shared/dto/validMovesDto.model';
import { Cell, CellTarget } from 'src/app/shared/chessTable.model';
import { Color } from 'src/app/shared/enums/enums.model';
import { FigureDto } from 'src/app/shared/dto/figureDto.model';
import { CoordinateDto } from 'src/app/shared/dto/coordinateDto.model';


@Component({
  selector: 'app-chess-table',
  templateUrl: './chess-table.component.html',
  styleUrls: ['./chess-table.component.css']
})
export class ChessTableComponent implements OnInit, OnDestroy {

  @Input() private gameSelected: ChessTableDto;
  private gameValidMoves: ValidMovesDto;
  private subscription: Subscription;
  private table: Cell[][] = [];

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.subscription = this.gameService.gameValidMovesChange.subscribe((response: ValidMovesDto) => {
      this.gameValidMoves = response;
      this.createTable();
    });
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
  }

  getFigure(row: number, column: number): FigureDto {
      const figure: FigureDto = this.gameSelected.figures.find(fig => fig.coordX === column && fig.coordY === row);
      return figure;
  }

  getTargets(row: number, column: number): CellTarget[] {
    const coordinates: CoordinateDto[] = this.gameValidMoves.validMoves.filter(target => target.fromX === column && target.fromY === row);

    const targets: CellTarget[] = coordinates.map(coord => {
      const target: CellTarget = {
        coordX: coord.toY - 1,
        coordY: coord.toX - 1
      };
      return target;
    });

    return targets;
  }

  onSelectCell(selectedCell: Cell) {
    this.gameService.clickOnCell(selectedCell);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
