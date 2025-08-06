import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  HostListener,
  inject,
  input,
  Input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AllowedQueryParamsCommon, ROWS_LIMIT_LIST } from '@shared/constants';

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

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const { key, target } = event;
    const isTextInput =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      (target instanceof HTMLElement && target.isContentEditable);
    if (isTextInput) {
      return;
    }
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      this.onChangePage(
        (key === 'ArrowRight' && this.currentPage < this.totalPages) ||
          (key === 'ArrowLeft' && this.currentPage > 1)
          ? key === 'ArrowLeft'
            ? this.currentPage - 1
            : this.currentPage + 1
          : key === 'ArrowLeft'
          ? this.totalPages
          : 1
      );
      event.preventDefault();
      return;
    }
  }

  @Input() currentPage!: number;
  @Input() dataLength!: number;
  readonly rowsLimit = input<number>();

  rowsLimitForm: FormGroup = this.fb.group({ rowsLimit: [undefined] });
  rowsLimitFormValues = toSignal(this.rowsLimitForm.valueChanges);

  rowsLimitList = ROWS_LIMIT_LIST;

  constructor() {
    effect(() => {
      const rowsLimit = this.rowsLimit();
      this.rowsLimitForm.patchValue(rowsLimit ? { rowsLimit } : {}, {
        emitEvent: false,
      });
    });
    effect(() => {
      if (this.rowsLimitFormValues()) {
        const rowsLimit = this.rowsLimitFormValues()['rowsLimit'];
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { [AllowedQueryParamsCommon.ROWS_LIMIT]: rowsLimit },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  get totalPages(): number {
    const totalPages =
      this.dataLength > 0 ? Math.ceil(this.dataLength / this.rowsLimit()!) : 1;
    if (this.currentPage > totalPages) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { [AllowedQueryParamsCommon.PAGE]: totalPages },
        queryParamsHandling: 'merge',
      });
    }
    return totalPages;
  }

  get resultsOnPage(): number {
    if (this.currentPage < 1 || this.currentPage > this.totalPages) return 0;
    const resultsOnLastPage =
      this.dataLength - (this.totalPages - 1) * this.rowsLimit()!;
    return this.currentPage < this.totalPages
      ? this.rowsLimit()!
      : resultsOnLastPage;
  }

  onChangePage(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [AllowedQueryParamsCommon.PAGE]: page },
      queryParamsHandling: 'merge',
    });
  }
}
