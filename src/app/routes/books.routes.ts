import { Routes } from '@angular/router';
import { ROW_ID } from '@shared/constants';
import { BookDetailComponent } from '../components/books/book-detail/book-detail.component';
import { BooksComponent } from '../components/books/books.component';
import { bookGuard } from './guards/book.guard';
import { booksGuard } from './guards/books.guard';

export const routes: Routes = [
  {
    path: '',
    component: BooksComponent,
    canActivate: [booksGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: `:${ROW_ID}`,
        component: BookDetailComponent,
        canActivate: [bookGuard],
      },
    ],
  },
];
