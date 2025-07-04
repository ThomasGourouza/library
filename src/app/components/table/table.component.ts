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
import { Header, ITEMS_PER_PAGE_DEFAULT, SortParams } from '@shared/constants';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TableFilterPipe } from 'app/pipes/table-filter.pipe';
import { TableSortPipe } from 'app/pipes/table-sort.pipe';
import { PaginatePipe } from 'app/pipes/paginate.pipe';

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
  private fb = inject(NonNullableFormBuilder);
  private readonly injector = inject(Injector);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @Input() data: any[] = [];
  @Input() filterParams: Params | null = null;
  @Input() sortParams: SortParams | null = null;
  private _headers: Header[] = [];
  @Input() set headers(value: Header[]) {
    this._headers = value;
    this.buildForm(value);
  }
  get headers(): Header[] {
    return this._headers;
  }
  @Input() rowId: string | undefined;
  @Input() currentPage!: number;
  @Output() selectedPage = new EventEmitter<number>();
  @Output() selectedRow = new EventEmitter<SelectedRow>();

  form!: FormGroup;
  formValues!: Signal<Record<string, string>>;

  itemsPerPage: number = ITEMS_PER_PAGE_DEFAULT;

  constructor() {
    effect(() => {
      if (this.formValues()) {
        const queryParams: Params = Object.fromEntries(
          Object.entries(this.formValues()).map(([key, value]) => [
            key,
            value !== '' ? this.withoutLastComma(value) : undefined,
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
      headers.map(({ name }) => [name, [this.filterParams?.[name] ?? '']])
    );
    this.form = this.fb.group(controls);
    runInInjectionContext(this.injector, () => {
      this.formValues = toSignal(this.form.valueChanges);
    });
  }

  private withoutLastComma(value: string): string {
    return value.endsWith(',') ? value.slice(0, -1) : value;
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
