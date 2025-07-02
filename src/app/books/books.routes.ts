import { Routes } from '@angular/router';
import { BookComponent } from './book/book.component';
import { BooksComponent } from './books.component';
import { queryParamGuard } from './query-param.guard';

export const routes: Routes = [
  {
    path: '',
    component: BooksComponent,
    canActivate: [queryParamGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: ':bookId',
        component: BookComponent,
      },
    ],
  },
];
