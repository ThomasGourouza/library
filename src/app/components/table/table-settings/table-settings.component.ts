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

  @Input() headers: Header[] = [];
  @Output() newHeaders = new EventEmitter<Header[]>();

  onSubmit(): void {
    this.newHeaders.emit(this.headers);
  }

  settingsForm!: FormGroup;
}
