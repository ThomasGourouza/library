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
import { PAGE_LIMITS } from '@shared/constants';

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
    const { key } = event;
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
  readonly pageLimit = input<number>();

  pageLimitForm: FormGroup = this.fb.group({ pageLimit: [undefined] });
  pageLimitFormValues = toSignal(this.pageLimitForm.valueChanges);

  pageLimits = PAGE_LIMITS;

  constructor() {
    effect(() => {
      const pageLimit = this.pageLimit();
      this.pageLimitForm.patchValue(pageLimit ? { pageLimit } : {}, {
        emitEvent: false,
      });
    });
    effect(() => {
      if (this.pageLimitFormValues()) {
        const page_limit = this.pageLimitFormValues()['pageLimit'];
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { page_limit },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  get totalPages(): number {
    const totalPages =
      this.dataLength > 0 ? Math.ceil(this.dataLength / this.pageLimit()!) : 1;
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
      this.dataLength - (this.totalPages - 1) * this.pageLimit()!;
    return this.currentPage < this.totalPages
      ? this.pageLimit()!
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
