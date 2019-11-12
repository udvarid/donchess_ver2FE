import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChessGameDto } from 'src/app/shared/dto/chessGameDto.model';
import { Subscription } from 'rxjs';
import { GameService } from '../game.service';
import { ChessGameStatus, Color } from 'src/app/shared/enums/enums.model';


@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit, OnDestroy {

  private games: ChessGameDto[];
  public openGames: ChessGameDto[];
  public closedGames: ChessGameDto[];
  private subscription: Subscription;
  private subscription2: Subscription;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.subscription = this.gameService.gamesChanged.subscribe((response: ChessGameDto[]) => {
      this.games = response;
      this.openGames = response.filter(game => game.chessGameStatus === ChessGameStatus.Open);
      this.closedGames = response.filter(game => game.chessGameStatus !== ChessGameStatus.Open);
      this.openGames = this.openGames.filter(game => this.amINext(game))
                  .concat(this.openGames.filter(game => !this.amINext(game)));
    });
    this.subscription2 = this.gameService.succesResign.subscribe((result: boolean) => {
      if (result) {
        this.gameService.getGameList();
      }
    });
    this.gameService.getGameList();
  }

  onSelect(index: number) {
    this.gameService.getGameSelected(this.openGames[index].chessGameId);
  }

  onSelectClosed(index: number) {
    this.gameService.getGameSelected(this.closedGames[index].chessGameId);
  }

  amINext(game: ChessGameDto): boolean {
    return this.gameService.amINext(game);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

}
