import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ChessTableDto } from 'src/app/shared/dto/chessTableDto.model';
import { GameService } from '../game.service';
import { Subscription } from 'rxjs';
import { ValidMovesDto } from 'src/app/shared/dto/validMovesDto.model';

@Component({
  selector: 'app-chess-table',
  templateUrl: './chess-table.component.html',
  styleUrls: ['./chess-table.component.css']
})
export class ChessTableComponent implements OnInit, OnDestroy {

  @Input() private gameSelected: ChessTableDto;
  private gameValidMoves: ValidMovesDto;
  private subscription: Subscription;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.subscription = this.gameService.gameValidMovesChange.subscribe((response: ValidMovesDto) => {
      this.gameValidMoves = response;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
