import { CommonModule } from '@angular/common';
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
  Header,
  SortParams,
} from '@shared/constants';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TableFilterPipe } from 'app/pipes/table-filter.pipe';
import { TableSortPipe } from 'app/pipes/table-sort.pipe';
import { PaginatePipe } from 'app/pipes/paginate.pipe';
import { UtilsService } from 'app/services/utils.service';

export type SelectedRow = { previousId: string | undefined; newId: string };
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
  private utilsService = inject(UtilsService);
  private fb = inject(NonNullableFormBuilder);
  private readonly injector = inject(Injector);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @Input() data: any[] = [];
  @Input() sortParams: SortParams | null = null;
  @Input() rowId: string | undefined;
  @Input() currentPage!: number;
  @Input() pageLimit!: number;
  @Output() selectedPage = new EventEmitter<number>();
  @Output() selectedRow = new EventEmitter<SelectedRow>();

  private _filterParams: Params | null = null;
  @Input() set filterParams(value: Params | null) {
    this._filterParams = value;
    this.form?.patchValue(value ?? {}, { emitEvent: false });
  }
  get filterParams(): Params | null {
    return this._filterParams;
  }

  private _headers: Header[] = [];
  @Input() set headers(value: Header[]) {
    this._headers = value;
    this.buildForm(value);
  }
  get headers(): Header[] {
    return this._headers;
  }

  form!: FormGroup;
  formValues!: Signal<Record<string, string>>;

  constructor() {
    effect(() => {
      if (this.formValues()) {
        const queryParams: Params = Object.fromEntries(
          Object.entries(this.formValues()).map(([key, value]) => [
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
      ALLOWED_FILTER_PARAMS_KEYS(headers).map((filterParam) => {
        return [filterParam, ['']];
      })
    );
    this.form = this.fb.group(controls);
    runInInjectionContext(this.injector, () => {
      this.formValues = toSignal(this.form.valueChanges);
    });
  }

  resetForm(): void {
    this.form.reset();
  }

  onChangePage(page: number) {
    this.selectedPage.emit(page);
  }

  onRowClick(row: any) {
    this.selectedRow.emit({ previousId: this.rowId, newId: row.id });
  }
}
