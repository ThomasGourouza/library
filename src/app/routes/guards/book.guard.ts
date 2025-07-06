import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ROW_ID } from '@shared/constants';
import { BookService } from 'app/services/book.service';
import { map } from 'rxjs';

export const bookGuard: CanActivateFn = (route, _state) => {
  const router = inject(Router);
  const bookService = inject(BookService);

  const bookId = route.params[ROW_ID];

  return bookService.books$.pipe(
    map((books) =>
      books.some((book) => book[ROW_ID] === bookId)
        ? true
        : router.createUrlTree(['/not-found'])
    )
  );
};
