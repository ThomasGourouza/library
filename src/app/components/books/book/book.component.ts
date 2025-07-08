import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ROW_ID } from '@shared/constants';
import { map } from 'rxjs';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [],
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss',
})
export class BookComponent {
  private route = inject(ActivatedRoute);

  readonly id = toSignal(
    this.route.params.pipe(map((p) => p[ROW_ID] as string))
  );
}
