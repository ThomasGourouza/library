import { Routes } from '@angular/router';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { ensurePagingGuard } from './guards/ensure-paging.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'books',
    pathMatch: 'full',
  },
  {
    path: 'books',
    canActivate: [ensurePagingGuard],
    loadChildren: () => import('./books.routes').then((m) => m.routes),
  },
  {
    path: 'authors',
    canActivate: [ensurePagingGuard],
    loadChildren: () => import('./authors.routes').then((m) => m.routes),
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
