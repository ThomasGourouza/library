import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  inject,
  Injector,
  Input,
  Output,
  runInInjectionContext,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PaginatorComponent } from './paginator/paginator.component';
import {
  ALLOWED_FILTER_PARAMS_KEYS,
  BOOKS_HEADERS,
  Header,
} from '@shared/constants';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { TableFilterPipe } from 'app/pipes/table-filter.pipe';
import { TableSortPipe } from 'app/pipes/table-sort.pipe';
import { PaginatePipe } from 'app/pipes/paginate.pipe';
import { UtilsService } from 'app/services/utils.service';
import {
  map,
  distinctUntilChanged,
  shareReplay,
  tap,
  filter,
  startWith,
  Observable,
} from 'rxjs';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorComponent,
    ReactiveFormsModule,
    TableFilterPipe,
    TableSortPipe,
    PaginatePipe,
    AsyncPipe,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  private readonly injector = inject(Injector);
  private utilsService = inject(UtilsService);
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @Input() data: any[] = [];
  @Input() set headers(value: Header[]) {
    this._headers = value;
    this.buildForm(value);
  }
  get headers(): Header[] {
    return this._headers;
  }
  private _headers: Header[] = [];
  @Output() selectedRow = new EventEmitter<string | undefined>();

  rowId!: Signal<any>;
  filterParams!: Signal<any>;

  private readonly paramMap$ = this.route.queryParamMap.pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  currentPage$ = this.paramMap$.pipe(
    map((p) => +p.get('page')!),
    distinctUntilChanged()
  );

  pageLimit$ = this.paramMap$.pipe(
    map((p) => +p.get('page_limit')!),
    distinctUntilChanged()
  );

  sortParams$ = this.paramMap$.pipe(
    map((p) => ({
      sortColumn: p.get('sortColumn'),
      sortDirection: p.get('sortDirection'),
    })),
    distinctUntilChanged()
  );

  filterForm!: FormGroup;
  filterFormValues!: Signal<Record<string, string>>;

  constructor() {
    effect(() => {
      if (this.filterFormValues()) {
        const queryParams: Params = Object.fromEntries(
          Object.entries(this.filterFormValues()).map(([key, value]) => [
            key,
            value && value !== ''
              ? this.utilsService.withoutLastComma(value)
              : undefined,
          ])
        );
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams,
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  private buildForm(headers: Header[]): void {
    const controls = Object.fromEntries(
      ALLOWED_FILTER_PARAMS_KEYS(headers).map((filterParamKey) => {
        return [filterParamKey, ['']];
      })
    );
    this.filterForm = this.fb.group(controls);

    runInInjectionContext(this.injector, () => {
      this.filterFormValues = toSignal(this.filterForm.valueChanges);
      this.rowId = toSignal(
        this.router.events.pipe(
          filter((e): e is NavigationEnd => e instanceof NavigationEnd),
          map(() => this.route.snapshot.firstChild?.params?.['bookId']),
          startWith(this.route.snapshot.firstChild?.params?.['bookId']),
          distinctUntilChanged()
        )
      );
      this.filterParams = toSignal(
        this.paramMap$.pipe(
          map((p) =>
            Object.fromEntries(
              ALLOWED_FILTER_PARAMS_KEYS(BOOKS_HEADERS).map((field) => [
                field,
                p.get(field),
              ])
            )
          ),
          distinctUntilChanged((a, b) =>
            ALLOWED_FILTER_PARAMS_KEYS(BOOKS_HEADERS).every(
              (field) => a[field] === b[field]
            )
          ),
          tap((params) =>
            this.filterForm?.patchValue(params ?? {}, { emitEvent: false })
          )
        )
      );
    });
  }

  resetForm(): void {
    this.filterForm.reset();
  }

  onRowClick(previousId: string | undefined, newId: string): void {
    this.selectedRow.emit(newId !== previousId ? newId : undefined);
  }
}
