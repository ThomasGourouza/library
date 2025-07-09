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
    this._headers = value;
    this.settingsForm = this.fb.group(
      Object.fromEntries([
        ...value.map(({ name, isVisible }) => {
          return [name, [isVisible]];
        }),
        ...value.map(({ name, isVisible }) => {
          return [`${name}Order`, [1]];
        }),
      ])
    );
  }
  private _headers: Header[] = [];
  get headers(): Header[] {
    return this._headers;
  }

  // setAllColumnsVisible() {
  //   this.headers.forEach(({ name }) => {
  //     this.settingsForm.get(name)?.setValue(true);
  //   });
  // }

  onDown(headerName: string, order: number): void {
    console.log(`Moving down: ${headerName} from order ${order}`);
  }

  onUp(headerName: string, order: number): void {
    console.log(`Moving up: ${headerName} from order ${order}`);
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
