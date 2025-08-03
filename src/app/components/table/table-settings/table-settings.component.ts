import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Header } from '@shared/constants';
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

  settingsForm!: FormGroup;
  settingsFormValuesSubscription = new Subscription();

  @Output() newHeaders = new EventEmitter<Header[]>();
  @Input() set headers(value: Header[]) {
    this._headers = [...value].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
    this.settingsForm = this.fb.group(
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
      this.settingsForm.valueChanges.subscribe((values) => {
        this.newHeaders.emit(
          this.headers.map((header) => ({
            ...header,
            isVisible: values[header.name] ?? false,
          }))
        );
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
        this.settingsForm.get(`${name}Rank`)?.setValue(currentOrder + 1);
      if (currentOrder + 1 === rank)
        this.settingsForm.get(`${name}Rank`)?.setValue(currentOrder);
    });
  }

  onUp(currentOrder: number): void {
    this.headers.forEach(({ name, rank }) => {
      if (currentOrder === rank)
        this.settingsForm.get(`${name}Rank`)?.setValue(currentOrder - 1);
      if (currentOrder - 1 === rank)
        this.settingsForm.get(`${name}Rank`)?.setValue(currentOrder);
    });
  }
}
