import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MIN_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
  DEFAULT_PAGE_LIMIT,
} from '@shared/constants';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(NonNullableFormBuilder);

  @Input() currentPage!: number;
  @Input() dataLength!: number;

  private _pageLimit!: number;
  @Input() set pageLimit(pageLimit: number) {
    this._pageLimit = pageLimit;
    this.pageLimitForm?.patchValue(pageLimit ? { pageLimit } : {}, {
      emitEvent: false,
    });
  }
  get pageLimit(): number {
    return this._pageLimit;
  }

  pageLimitForm: FormGroup = this.fb.group({ pageLimit: undefined });
  pageLimitFormValues = toSignal(this.pageLimitForm.valueChanges);

  minPageLimit = MIN_PAGE_LIMIT;
  maxPageLimit = MAX_PAGE_LIMIT;

  constructor() {
    effect(() => {
      if (this.pageLimitFormValues()) {
        const page_limit = this.pageLimitFormValues()['pageLimit'];
        const clamped = Math.min(
          Math.max(page_limit, this.minPageLimit),
          this.maxPageLimit
        );
        // TODO: remove "if" block if use select instead of input
        if (page_limit !== clamped) {
          this.pageLimitForm?.patchValue({ pageLimit: clamped });
        } else {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page_limit },
            queryParamsHandling: 'merge',
          });
        }
      }
    });
  }

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
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }
}
