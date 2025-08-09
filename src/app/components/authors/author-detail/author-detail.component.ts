import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorService } from 'app/services/author.service';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-author',
  standalone: true,
  imports: [],
  templateUrl: './author-detail.component.html',
  styleUrl: './author-detail.component.scss',
})
export class AuthorDetailComponent {
  private authorService = inject(AuthorService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  author = toSignal(
    combineLatest([this.authorService.authors$, this.route.params]).pipe(
      map(([authors, params]) => authors.find((a) => a.id === params['id']))
    )
  );

  closeDetails() {
    const root = this.router.parseUrl(this.router.url).root.children['primary']
      ?.segments[0]?.path;
    if (!root) return;
    this.router.navigate([`/${root}`], {
      queryParamsHandling: 'preserve',
    });
  }
}
