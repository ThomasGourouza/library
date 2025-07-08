import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ROW_ID } from '@shared/constants';
import { map } from 'rxjs';

@Component({
  selector: 'app-author',
  standalone: true,
  imports: [],
  templateUrl: './author.component.html',
  styleUrl: './author.component.scss',
})
export class AuthorComponent {
  private route = inject(ActivatedRoute);

  readonly id = toSignal(
    this.route.params.pipe(map((p) => p[ROW_ID] as string))
  );
}
