import { Routes } from '@angular/router';
import { BookComponent } from './book/book.component';
import { BooksComponent } from './books.component';

export const routes: Routes = [
  {
    path: '',
    component: BooksComponent,
    children: [
      {
        path: ':bookId',
        component: BookComponent,
      },
    ],
  },
];
