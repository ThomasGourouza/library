import { Routes } from '@angular/router';
import { AuthorsComponent } from 'app/components/authors/authors.component';
import { AuthorComponent } from 'app/components/authors/author/author.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthorsComponent,
    children: [
      {
        path: ':id',
        component: AuthorComponent,
      },
    ],
  },
];
