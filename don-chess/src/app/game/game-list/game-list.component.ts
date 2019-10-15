import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChessGameDto } from 'src/app/shared/dto/chessGameDto.model';
import { Subscription } from 'rxjs';
import { GameService } from '../game.service';
import { ChessGameStatus } from 'src/app/shared/enums/enums.model';


@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit, OnDestroy {

  private games: ChessGameDto[];
  private openGames: ChessGameDto[];
  private subscription: Subscription;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.subscription = this.gameService.gamesChanged.subscribe((response: ChessGameDto[]) => {
      this.games = response;
      this.openGames = response.filter(game => game.chessGameStatus === ChessGameStatus.Open);
    });
    this.gameService.getGameList();
  }

  onSelect(index: number) {
    this.gameService.getGameSelected(this.openGames[index].chessGameId);
    this.gameService.getGameValidMoves(this.openGames[index].chessGameId);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
