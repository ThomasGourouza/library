import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Header } from 'app/models/header';
import { OrderPipe } from 'app/pipes/order.pipe';
import { LocalStorageService } from 'app/services/local-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './table-settings.component.html',
  styleUrl: './table-settings.component.scss',
})
export class TableSettingsComponent implements OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly orderPipe = inject(OrderPipe);

  visibleColumnForm!: FormGroup;
  settingsFormValuesSubscription = new Subscription();

  @Output() newHeaders = new EventEmitter<Header[]>();
  @Input() set headers(value: Header[]) {
    this._headers = this.orderPipe.transform([...value]);
    this.visibleColumnForm = this.fb.group(
      Object.fromEntries([
        ...value.map(({ name, isVisible }) => {
          return [name, [isVisible]];
        }),
        ...value.map(({ name, rank }) => {
          return [`${name}Rank`, [rank]];
        }),
      ])
    );
    this.settingsFormValuesSubscription =
      this.visibleColumnForm.valueChanges.subscribe((values) => {
        const updatedHeaders = this.headers.map((header) => ({
          ...header,
          isVisible: values[header.name] ?? false,
        }));
        this.newHeaders.emit(updatedHeaders);
        this.localStorageService.saveHeadersInLocalStorage(updatedHeaders);
      });
  }
  private _headers: Header[] = [];
  get headers(): Header[] {
    return this._headers;
  }

  ngOnDestroy(): void {
    this.settingsFormValuesSubscription.unsubscribe();
  }

  onDown(currentOrder: number): void {
    this.headers.forEach(({ name, rank }) => {
      if (currentOrder === rank)
        this.visibleColumnForm.get(`${name}Rank`)?.setValue(currentOrder + 1);
      if (currentOrder + 1 === rank)
        this.visibleColumnForm.get(`${name}Rank`)?.setValue(currentOrder);
    });
  }

  onUp(currentOrder: number): void {
    this.headers.forEach(({ name, rank }) => {
      if (currentOrder === rank)
        this.visibleColumnForm.get(`${name}Rank`)?.setValue(currentOrder - 1);
      if (currentOrder - 1 === rank)
        this.visibleColumnForm.get(`${name}Rank`)?.setValue(currentOrder);
    });
  }
}
