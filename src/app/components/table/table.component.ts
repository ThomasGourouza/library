import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  Injector,
  Input,
  runInInjectionContext,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Header, HeaderNameAuthor, HeaderType } from 'app/models/header';
import {
  AllowedQueryParamsCommon,
  Between,
  SortDirection,
  TableItem,
  toAllowedFilterParamsKeys,
} from 'app/models/types';
import { DisplayPipe } from 'app/pipes/display.pipe';
import { SortIconSrcPipe } from 'app/pipes/sort-icon-src.pipe';
import { OrderPipe } from 'app/pipes/order.pipe';
import { PaginatePipe } from 'app/pipes/paginate.pipe';
import { PlusSrcPipe } from 'app/pipes/plus-src.pipe';
import { SelectListPipe } from 'app/pipes/select-list.pipe';
import { TableColumnVisiblePipe } from 'app/pipes/table-column-visible.pipe';
import { TableFilterPipe } from 'app/pipes/table-filter.pipe';
import { TableSortPipe } from 'app/pipes/table-sort.pipe';
import { LocalStorageService } from 'app/services/local-storage.service';
import { UtilsService } from 'app/services/utils.service';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs';
import { PaginatorComponent } from './paginator/paginator.component';
import { TableSettingsComponent } from './table-settings/table-settings.component';
import { HeaderIconSrcPipe } from 'app/pipes/header-icon-src.pipe';

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
    SortIconSrcPipe,
    TableColumnVisiblePipe,
    OrderPipe,
    DisplayPipe,
    PlusSrcPipe,
    SelectListPipe,
    HeaderIconSrcPipe,
    TableSettingsComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  private readonly injector = inject(Injector);
  private readonly utilsService = inject(UtilsService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly elRef = inject(ElementRef<HTMLElement>);

  private readonly tableFilterPipe = inject(TableFilterPipe);
  private readonly orderPipe = inject(OrderPipe);
  private readonly tableSortPipe = inject(TableSortPipe);
  private readonly paginatePipe = inject(PaginatePipe);
  private readonly tableColumnVisiblePipe = inject(TableColumnVisiblePipe);

  min = Between.MIN;
  max = Between.MAX;
  birthYear = HeaderNameAuthor.BIRTH_YEAR;
  deathYear = HeaderNameAuthor.DEATH_YEAR;

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
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      if (this.data.length === 0) {
        return;
      }
      const displayedData = this.paginatePipe.transform(
        this.tableSortPipe.transform(
          this.tableFilterPipe.transform(this.data, this.filterParams()),
          this.sortParams()
        ),
        this.currentPage(),
        this.rowsLimit()
      );
      const currentIndex = displayedData.findIndex(
        (item) => item.id === this.rowId()
      );
      const isInPage = currentIndex !== -1;
      const first = 0;
      const last = displayedData.length - 1;
      let nextIndex: number;
      if (key === 'ArrowDown') {
        nextIndex = isInPage && currentIndex < last ? currentIndex + 1 : first;
      } else {
        nextIndex = isInPage && currentIndex > first ? currentIndex - 1 : last;
      }
      this.onRowClick(this.rowId(), displayedData[nextIndex].id);
      event.preventDefault();
      return;
    }
    if (key === 'Escape') {
      this.onRowClick(this.rowId(), this.rowId());
      event.preventDefault();
      return;
    }
  }

  private _headers: Header[] = [];
  filterForm!: FormGroup;
  filterFormValues!: Signal<{ [k: string]: string | undefined }>;
  filterParams!: Signal<{ [k: string]: string | undefined }>;

  @Input() data: TableItem[] = [];
  @Input() set headers(value: Header[]) {
    this._headers = this.localStorageService.getHeadersFromLocalStorage(value);
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
      map(() => this.route.snapshot.firstChild?.params?.['id']),
      startWith(this.route.snapshot.firstChild?.params?.['id']),
      distinctUntilChanged()
    )
  );

  private paramMap = toSignal(this.route.queryParamMap);

  currentPage = computed(
    () => +this.paramMap()!.get(AllowedQueryParamsCommon.PAGE)!
  );

  rowsLimit = computed(
    () => +this.paramMap()!.get(AllowedQueryParamsCommon.ROWS_LIMIT)!
  );

  sortParams = computed(() => ({
    [AllowedQueryParamsCommon.SORT_COLUMN]: this.paramMap()!.get(
      AllowedQueryParamsCommon.SORT_COLUMN
    ),
    [AllowedQueryParamsCommon.SORT_DIRECTION]: this.paramMap()!.get(
      AllowedQueryParamsCommon.SORT_DIRECTION
    ) as SortDirection | null,
  }));

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

  onAddSearch(headerName: string): void {
    const control = this.filterForm.get(headerName);
    const current = control!.value ?? '';
    const needsComma = current.length > 0 && !current.endsWith(',');
    const next = needsComma ? `${current},` : current;
    control!.setValue(next, { emitEvent: false });

    setTimeout(() => {
      const el = this.elRef.nativeElement.querySelector(
        `#${headerName}-search`
      ) as HTMLInputElement | null;
      if (el) {
        el.focus();
        const end = el.value.length;
        try {
          el.setSelectionRange(end, end);
        } catch {
          console.error("Not a text input");
        }
      }
    });
  }

  onNewHeaders(headers: Header[]): void {
    this._headers = headers;
  }

  hasBetween(header: Header): boolean {
    return header.type === HeaderType.NUMBER;
  }

  hasSearch(header: Header): boolean {
    return header.type === HeaderType.TEXT;
  }

  hasSelect(header: Header): boolean {
    return [HeaderType.BOOLEAN, HeaderType.ENUM].includes(header.type);
  }

  private moveColumn(headerName: string, direction: -1 | 1): void {
    const headers = [...this._headers];
    const orderedVisibleHeaders = this.orderPipe.transform(
      this.tableColumnVisiblePipe.transform(headers)
    );
    const currentColumnIndex = orderedVisibleHeaders.findIndex(
      ({ name }) => name === headerName
    );
    const currentColumnName = orderedVisibleHeaders[currentColumnIndex].name;
    const targetColumnName =
      orderedVisibleHeaders[currentColumnIndex + direction].name;

    const currentColumn = headers.find(
      ({ name }) => name === currentColumnName
    )!;
    const targetColumn = headers.find(({ name }) => name === targetColumnName)!;

    [currentColumn.rank, targetColumn.rank] = [
      targetColumn.rank,
      currentColumn.rank,
    ];
    this._headers = headers;
    this.localStorageService.saveHeadersInLocalStorage(this._headers);
  }
}
