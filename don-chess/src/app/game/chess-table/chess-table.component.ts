import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { GameService } from '../game.service';
import { Subscription } from 'rxjs';
import { Cell } from 'src/app/shared/chessTable.model';


@Component({
  selector: 'app-chess-table',
  templateUrl: './chess-table.component.html',
  styleUrls: ['./chess-table.component.css']
})
export class ChessTableComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  public table: Cell[][] = [];

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.subscription = this.gameService.chessTableChanged.subscribe((response: Cell[][]) => {
      this.table = response;
    });
  }

  onSelectCell(selectedCell: Cell) {
    this.gameService.clickOnCell(selectedCell);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
