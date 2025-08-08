import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from 'app/services/book.service';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss',
})
export class BookDetailComponent {
  private bookService = inject(BookService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  book = toSignal(
    combineLatest([this.bookService.books$, this.route.params]).pipe(
      map(([books, params]) => books.find((b) => b['id'] === params['id']))
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
