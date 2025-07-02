import { Routes } from '@angular/router';
import { NotFoundComponent } from '../components/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'books',
    pathMatch: 'full',
  },
  {
    path: 'books',
    loadChildren: () => import('./books.routes').then((m) => m.routes),
  },
  {
    path: 'authors',
    loadChildren: () =>
      import('../components/authors/authors.routes').then((m) => m.routes),
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
