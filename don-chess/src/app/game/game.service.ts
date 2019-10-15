import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChessGameDto } from '../shared/dto/chessGameDto.model';
import { Subject } from 'rxjs';
import { ChessTableDto } from '../shared/dto/chessTableDto.model';
import { ValidMovesDto } from '../shared/dto/validMovesDto.model';

@Injectable({ providedIn: 'root' })

export class GameService {

    private games: ChessGameDto[] = [];
    private gameSelected: ChessTableDto;
    private gameValidMoves: ValidMovesDto;
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

}
