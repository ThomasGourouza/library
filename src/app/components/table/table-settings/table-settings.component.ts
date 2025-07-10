import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  FormGroup,
} from '@angular/forms';
import { Header } from '@shared/constants';

@Component({
  selector: 'app-table-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './table-settings.component.html',
  styleUrl: './table-settings.component.scss',
})
export class TableSettingsComponent {
  private fb = inject(NonNullableFormBuilder);

  settingsForm!: FormGroup;

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
  }
  private _headers: Header[] = [];
  get headers(): Header[] {
    return this._headers;
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

  onSubmit(): void {
    this.newHeaders.emit(
      this.headers.map((header) => ({
        ...header,
        isVisible: this.settingsForm.get(header.name)?.value ?? false,
      }))
    );
  }
}
