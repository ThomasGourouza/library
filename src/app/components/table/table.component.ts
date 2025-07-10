import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  Input,
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
  TableItem,
  Between,
  SortDirection,
} from '@shared/constants';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TableFilterPipe } from 'app/pipes/table-filter.pipe';
import { TableSortPipe } from 'app/pipes/table-sort.pipe';
import { PaginatePipe } from 'app/pipes/paginate.pipe';
import { UtilsService } from 'app/services/utils.service';
import { map, distinctUntilChanged, filter, startWith } from 'rxjs';
import { IconSrcPipe } from 'app/pipes/icon-src.pipe';
import { TableSettingsComponent } from './table-settings/table-settings.component';
import { TableColumnVisiblePipe } from 'app/pipes/table-column-visible.pipe';
import { OrderPipe } from 'app/pipes/order.pipe';
import { UniquePipe } from 'app/pipes/unique.pipe';
import { PlusSrcPipe } from 'app/pipes/plus-src.pipe';

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
    IconSrcPipe,
    TableColumnVisiblePipe,
    OrderPipe,
    UniquePipe,
    PlusSrcPipe,
    TableSettingsComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  private readonly injector = inject(Injector);
  private readonly utilsService = inject(UtilsService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private _headers: Header[] = [];
  filterForm!: FormGroup;
  filterFormValues!: Signal<{ [k: string]: string | undefined }>;
  filterParams!: Signal<{ [k: string]: string | undefined }>;

  @Input() data: TableItem[] = [];
  @Input() set headers(value: Header[]) {
    this._headers = value;
    const allowedFilterParamsKeys = toAllowedFilterParamsKeys(value);
    this.filterForm = this.fb.group(
      Object.fromEntries(
        allowedFilterParamsKeys.map((filterParamKey) => {
          return [filterParamKey, ['']];
        })
      )
    );

    runInInjectionContext(this.injector, () => {
      this.filterFormValues = toSignal(this.filterForm.valueChanges);
      this.filterParams = computed(() =>
        Object.fromEntries(
          allowedFilterParamsKeys.map((field) => [
            field,
            this.paramMap()!.get(field) ?? undefined,
          ])
        )
      );
    });
  }
  get headers(): Header[] {
    return this._headers;
  }

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
    [AllowedQueryParamsCommon.SORT_COLUMN]: this.paramMap()!.get(
      AllowedQueryParamsCommon.SORT_COLUMN
    ),
    [AllowedQueryParamsCommon.SORT_DIRECTION]: this.paramMap()!.get(
      AllowedQueryParamsCommon.SORT_DIRECTION
    ) as SortDirection | null,
  }));

  id = ROW_ID;
  min = Between.MIN;
  max = Between.MAX;

  constructor() {
    effect(() => {
      if (this.filterFormValues()) {
        const queryParams: { [k: string]: string | undefined } =
          Object.fromEntries(
            Object.entries(this.filterFormValues()).map(([key, value]) => [
              key,
              value && value !== ''
                ? this.utilsService.withoutLastComma(value.toString())
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
    effect(() => {
      const sortColumnValue =
        this.sortParams()[AllowedQueryParamsCommon.SORT_COLUMN];
      const sortDirectionValue = this.sortParams()[
        AllowedQueryParamsCommon.SORT_DIRECTION
      ] as SortDirection;
      this.headers.forEach((header) => {
        header.sortDirection =
          header.name === sortColumnValue ? sortDirectionValue : null;
      });
    });
  }

  resetForm(): void {
    this.filterForm.reset();
  }

  onRowClick(previousId: string | undefined, newId: string): void {
    const root = this.router.parseUrl(this.router.url).root.children['primary']
      ?.segments[0]?.path;
    if (!root) return;
    const path = [`/${root}`];
    const newBookId = newId !== previousId ? newId : undefined;
    if (!!newBookId) path.push(newBookId);

    this.router.navigate(path, {
      queryParamsHandling: 'preserve',
    });
  }

  onSort(name: string, sortDirection: SortDirection | null): void {
    // asc -> desc -> null
    let newDirection;
    switch (sortDirection) {
      case SortDirection.ASC:
        newDirection = SortDirection.DESC;
        break;
      case SortDirection.DESC:
        newDirection = null;
        break;
      default:
        newDirection = SortDirection.ASC;
        break;
    }
    const queryParams = {
      [AllowedQueryParamsCommon.SORT_COLUMN]: !!newDirection ? name : null,
      [AllowedQueryParamsCommon.SORT_DIRECTION]: newDirection,
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  onLeft(headerName: string): void {
    this.moveColumn(headerName, -1);
  }

  onRight(headerName: string): void {
    this.moveColumn(headerName, 1);
  }

  onSelectChange(event: Event, headerName: string, isSelectAdd: boolean): void {
    const value = (event.target as HTMLSelectElement).value;
    const formValue = this.filterForm.get(headerName)!.value ?? '';

    const valueAddList = this.utilsService.cleanList([
      ...new Set(`${formValue},${value}`.split(',')),
    ]);
    const newValue = isSelectAdd ? valueAddList.join(',') : value;

    this.filterForm.get(headerName)!.setValue(newValue);
  }

  onReset(headerName: string): void {
    this.filterForm.get(headerName)!.reset();
  }

  private moveColumn(headerName: string, direction: -1 | 1): void {
    const orderedHeaders = [...this._headers];

    const currentColumn = orderedHeaders.find(
      ({ name }) => name === headerName
    )!;
    const targetColumn = orderedHeaders.find(
      ({ rank }) => rank === currentColumn.rank + direction
    )!;

    [currentColumn.rank, targetColumn.rank] = [
      targetColumn.rank,
      currentColumn.rank,
    ];

    this._headers = orderedHeaders;
  }

  onNewHeaders(headers: Header[]): void {
    this._headers = headers;
  }

  private get urlRowId(): string {
    return this.route.snapshot.firstChild?.params?.[this.id];
  }
}
