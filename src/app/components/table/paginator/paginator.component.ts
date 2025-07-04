import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  @Input() currentPage!: number;
  @Input() dataLength!: number;
  @Input() itemsPerPage!: number;
  @Output() changePage = new EventEmitter<any>();

  get totalPages(): number {
    return Math.ceil(this.dataLength / this.itemsPerPage);
  }

  onChangePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.changePage.emit(page);
    }
  }
}
