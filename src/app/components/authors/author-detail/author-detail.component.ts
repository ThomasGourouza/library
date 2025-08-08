import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-author',
  standalone: true,
  imports: [],
  templateUrl: './author-detail.component.html',
  styleUrl: './author-detail.component.scss',
})
export class AuthorDetailComponent {
  private route = inject(ActivatedRoute);

  readonly id = toSignal(
    this.route.params.pipe(map((p) => p['id'] as string))
  );
}
