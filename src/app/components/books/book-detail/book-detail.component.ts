import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ROW_ID } from '@shared/constants';
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
  private route = inject(ActivatedRoute);

  book = toSignal(
    combineLatest([this.bookService.books$, this.route.params]).pipe(
      map(([books, params]) => books.find((b) => b.id === params[ROW_ID]))
    )
  );
}
