import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorComponent } from './paginator/paginator.component';
import { Header, ITEMS_PER_PAGE } from '@shared/constants';

export type SelectedRow = { previousId: string | undefined; newId: string };
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
  @Input() set dataId(value: string | undefined) {
    this._dataId = value;
  }
  get dataId(): string | undefined {
    return this._dataId;
  }
  private _dataId: string | undefined = undefined;
  @Input() currentPage!: number;
  @Output() selectedPage = new EventEmitter<number>();
  @Output() selectedRow = new EventEmitter<SelectedRow>();

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * ITEMS_PER_PAGE;
    return this.data.slice(start, start + ITEMS_PER_PAGE);
  }

  get totalPages(): number {
    return Math.ceil(this.data.length / ITEMS_PER_PAGE);
  }

  onChangePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.selectedPage.emit(page);
    }
  }

  onRowClick(row: any) {
    this.selectedRow.emit({ previousId: this.dataId, newId: row.id });
  }
}
