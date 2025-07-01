import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorComponent } from './paginator/paginator.component';

export interface Header {
  name: string;
  label: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, PaginatorComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() headers: Header[] = [];
  @Input() set dataId(value: string | null) {
    this._dataId = value;
  }
  get dataId(): string | null {
    return this._dataId;
  }
  private _dataId: string | null = null;
  @Input() currentPage!: number;
  @Output() selectedPage = new EventEmitter<number>();
  @Output() selectedRow = new EventEmitter<string>();

  itemsPerPage = 15;

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.data.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.data.length / this.itemsPerPage);
  }

  onChangePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.selectedPage.emit(page);
    }
  }

  onRowClick(row: any) {
    this.selectedRow.emit(row.id);
  }
}
