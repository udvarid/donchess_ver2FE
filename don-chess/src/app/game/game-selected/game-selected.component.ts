import { Component, OnInit, Input } from '@angular/core';
import { ChessTableDto } from 'src/app/shared/dto/chessTableDto.model';

@Component({
  selector: 'app-game-selected',
  templateUrl: './game-selected.component.html',
  styleUrls: ['./game-selected.component.css']
})
export class GameSelectedComponent implements OnInit {

  @Input() private gameSelected: ChessTableDto;

  constructor() { }

  ngOnInit() {
  }

}
