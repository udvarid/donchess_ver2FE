import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { GameService } from '../game.service';
import { Subscription } from 'rxjs';
import { Cell } from 'src/app/shared/chessTable.model';
import { ModalService } from 'src/app/shared/modal/model.service';
import { ChessFigure, PromoteType, Color } from 'src/app/shared/enums/enums.model';


@Component({
  selector: 'app-chess-table',
  templateUrl: './chess-table.component.html',
  styleUrls: ['./chess-table.component.css']
})
export class ChessTableComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  private subscription2: Subscription;
  public table: Cell[][] = [];
  public selectedCellToSend: Cell;

  constructor(private gameService: GameService, private modalService: ModalService) { }

  ngOnInit() {
    this.subscription = this.gameService.chessTableChanged.subscribe((response: Cell[][]) => {
      this.table = response;
    });
    this.subscription2 = this.gameService.newPromotion.subscribe(() => {
      this.gameService.clickOnCell(this.selectedCellToSend);
    });
  }

  onSelectCell(selectedCell: Cell) {
    this.selectedCellToSend = selectedCell;
    if (!this.gameService.canBePromoted(selectedCell)) {
      this.gameService.clickOnCell(selectedCell);
    } else {
      this.modalService.open('promotion-modal');
    }
  }

  public modalOpen(modalName: string) {
    this.modalService.open(modalName);
  }

  isItWhite(): boolean {
    return this.gameService.getActualColor() === Color.White;
  }

  onSelectedQueen() {
    this.gameService.setPromotion(PromoteType.Queen);
    this.modalService.close('promotion-modal');
  }

  onSelectedBishop() {
    this.gameService.setPromotion(PromoteType.Bishop);
    this.modalService.close('promotion-modal');
  }

  onSelectedKnight() {
    this.gameService.setPromotion(PromoteType.Knight);
    this.modalService.close('promotion-modal');
  }

  onSelectedRook() {
    this.gameService.setPromotion(PromoteType.Rook);
    this.modalService.close('promotion-modal');
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

}
