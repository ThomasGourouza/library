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
  @Input() totalPages: number = 1;
  @Output() changePage = new EventEmitter<any>();

  onChangePage(page: number): void {
    this.changePage.emit(page);
  }
}
