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
  @Input() pageLimit!: number;
  @Output() changePage = new EventEmitter<any>();

  get totalPages(): number {
    return Math.ceil(this.dataLength / this.pageLimit);
  }

  get resultsOnPage(): number {
    if (this.currentPage < 1 || this.currentPage > this.totalPages) return 0;
    const resultsOnLastPage =
      this.dataLength - (this.totalPages - 1) * this.pageLimit;
    return this.currentPage < this.totalPages
      ? this.pageLimit
      : resultsOnLastPage;
  }

  onChangePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.changePage.emit(page);
    }
  }
}
