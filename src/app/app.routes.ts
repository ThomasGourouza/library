import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'books',
    pathMatch: 'full',
  },
  {
    path: 'books',
    loadChildren: () => import('./books/books.routes').then((m) => m.routes),
  },
  {
    path: 'authors',
    loadChildren: () =>
      import('./authors/authors.routes').then((m) => m.routes),
  },
  {
    path: '404-page-not-found',
    component: NotFoundComponent,
  },
  { path: '**', redirectTo: '404-page-not-found', pathMatch: 'full' },
];
