import { Component, OnInit, Input } from '@angular/core';
import { ChessTableDto } from 'src/app/shared/dto/chessTableDto.model';

@Component({
  selector: 'app-chess-table',
  templateUrl: './chess-table.component.html',
  styleUrls: ['./chess-table.component.css']
})
export class ChessTableComponent implements OnInit {

  @Input() gameSelected: ChessTableDto;

  constructor() { }

  ngOnInit() {
  }

}
