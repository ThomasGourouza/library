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
import { Header, ITEMS_PER_PAGE } from '@shared/constants';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

export type SelectedRow = { previousId: string | undefined; newId: string };
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, PaginatorComponent, ReactiveFormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  private fb = inject(NonNullableFormBuilder);
  private readonly injector = inject(Injector);

  @Input() data: any[] = [];
  private _headers: Header[] = [];
  @Input() set headers(value: Header[]) {
    this._headers = value;
    this.form = this.fb.group(
      Object.fromEntries(value.map(({ name }) => [name, ['']]))
    );
    runInInjectionContext(this.injector, () => {
      this.formValues = toSignal(this.form.valueChanges, {
        initialValue: this.form.getRawValue(),
      });
    });
  }
  get headers(): Header[] {
    return this._headers;
  }
  @Input() dataId: string | undefined;
  @Input() currentPage!: number;
  @Output() selectedPage = new EventEmitter<number>();
  @Output() selectedRow = new EventEmitter<SelectedRow>();

  form!: FormGroup;
  formValues!: Signal<Record<string, any>>;

  constructor() {
    effect(() => {
      console.log('Form value', this.formValues());
    });
  }

  resetForm(): void {
    this.form.reset();
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * ITEMS_PER_PAGE;
    return this.data.slice(start, start + ITEMS_PER_PAGE);
  }

  get totalPages(): number {
    return Math.ceil(this.data.length / ITEMS_PER_PAGE);
  }

  onChangePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.selectedPage.emit(page);
    }
  }

  onRowClick(row: any) {
    this.selectedRow.emit({ previousId: this.dataId, newId: row.id });
  }
}
