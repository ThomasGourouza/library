import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BookService } from 'app/services/book.service';
import { map } from 'rxjs';

export const bookGuard: CanActivateFn = (route, _state) => {
  const router = inject(Router);
  const bookService = inject(BookService);

  const bookId = route.params['bookId'];

  return bookService.books$.pipe(
    map((books) =>
      books.some(({ id }) => id === bookId)
        ? true
        : router.createUrlTree(['/not-found'])
    )
  );
};
