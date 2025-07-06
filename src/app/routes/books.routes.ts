import { Routes } from '@angular/router';
import { BookComponent } from '../components/books/book/book.component';
import { BooksComponent } from '../components/books/books.component';
import { booksGuard } from './guards/books.guard';
import { bookGuard } from './guards/book.guard';

export const routes: Routes = [
  {
    path: '',
    component: BooksComponent,
    canActivate: [booksGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: ':id',
        component: BookComponent,
        canActivate: [bookGuard],
      },
    ],
  },
];
