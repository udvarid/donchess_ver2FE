import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from './game.service';
import { ChessTableDto } from '../shared/dto/chessTableDto.model';
import { ChessGameDto } from '../shared/dto/chessGameDto.model';
import { Result } from '../shared/enums/enums.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

  public gameSelected: ChessTableDto = null;
  private selectedGameSubs: Subscription;
  private eogSubs: Subscription;
  private chessTableLoadSign: Subscription;

  private chessTableLoaded = false;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.selectedGameSubs = this.gameService.gameSelectedChange.subscribe((game: ChessTableDto) => {
      this.gameSelected = game;
    });
    this.eogSubs = this.gameService.endOfGameResult.subscribe(() => {
      this.gameSelected = null;
    });
    this.chessTableLoadSign = this.gameService.chessTableLoaded.subscribe( () => {
      this.chessTableLoaded = true;
    });

  }

  ngOnDestroy() {
    this.selectedGameSubs.unsubscribe();
    this.eogSubs.unsubscribe();
    this.chessTableLoadSign.unsubscribe();
  }

  amINext(game: ChessGameDto): boolean {
    return this.gameService.amINext(game) && game.result === Result.Open;
  }

  onResign() {
    this.gameService.resign(this.gameSelected.chessGameId);
  }

  onDrawOffer() {
    this.gameService.offerDraw();
  }

  onAcceptDraw() {
    this.gameService.acceptDraw(this.gameSelected.chessGameId);
  }

  isDrawOffered(): boolean {
    return this.gameService.drawOffered;
  }

}
