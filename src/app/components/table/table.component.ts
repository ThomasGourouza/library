import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
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
  toAllowedFilterParamsKeys,
  Header,
  AllowedQueryParamsCommon,
  ROW_ID,
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
import { map, distinctUntilChanged, filter, startWith } from 'rxjs';

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

  private _headers: Header[] = [];
  filterForm!: FormGroup;
  filterFormValues!: Signal<Record<string, string>>;
  filterParams!: Signal<any>;

  @Input() data: any[] = [];
  @Input() set headers(value: Header[]) {
    this._headers = value;
    this.filterForm = this.fb.group(
      Object.fromEntries(
        toAllowedFilterParamsKeys(value).map((filterParamKey) => {
          return [filterParamKey, ['']];
        })
      )
    );

    runInInjectionContext(this.injector, () => {
      this.filterFormValues = toSignal(this.filterForm.valueChanges);
      this.filterParams = computed(() =>
        Object.fromEntries(
          toAllowedFilterParamsKeys(value).map((field) => [
            field,
            this.paramMap()!.get(field),
          ])
        )
      );
    });
  }
  get headers(): Header[] {
    return this._headers;
  }
  @Output() selectedRow = new EventEmitter<string | undefined>();

  rowId = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.urlRowId),
      startWith(this.urlRowId),
      distinctUntilChanged()
    )
  );

  private paramMap = toSignal(this.route.queryParamMap);

  currentPage = computed(
    () => +this.paramMap()!.get(AllowedQueryParamsCommon.PAGE)!
  );

  pageLimit = computed(
    () => +this.paramMap()!.get(AllowedQueryParamsCommon.PAGE_LIMIT)!
  );

  sortParams = computed(() => ({
    sortColumn: this.paramMap()!.get(AllowedQueryParamsCommon.SORT_COLUMN),
    sortDirection: this.paramMap()!.get(
      AllowedQueryParamsCommon.SORT_DIRECTION
    ),
  }));

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
    effect(() => {
      this.filterForm?.patchValue(this.filterParams(), { emitEvent: false });
    });
  }

  resetForm(): void {
    this.filterForm.reset();
  }

  onRowClick(previousId: string | undefined, newId: string): void {
    this.selectedRow.emit(newId !== previousId ? newId : undefined);
  }

  private get urlRowId(): string {
    return this.route.snapshot.firstChild?.params?.[ROW_ID];
  }
}
