import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @Input() currentPage!: number;
  @Input() dataLength!: number;
  @Input() pageLimit!: number;
  @Output() changePage = new EventEmitter<any>();
  @Output() changePageLimit = new EventEmitter<any>();

  get totalPages(): number {
    const totalPages =
      this.dataLength > 0 ? Math.ceil(this.dataLength / this.pageLimit) : 1;
    if (this.currentPage > totalPages) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: totalPages },
        queryParamsHandling: 'merge',
      });
    }
    return totalPages;
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

  onChangePageLimit(target: EventTarget | null): void {
    const page_limit = Number((target as HTMLSelectElement)?.value);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page_limit },
      queryParamsHandling: 'merge',
    });
  }
}
