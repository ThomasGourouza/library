import { Routes } from '@angular/router';
import { AuthorsComponent } from './authors.component';
import { AuthorComponent } from './author/author.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthorsComponent,
    children: [
      {
        path: ':authorId',
        component: AuthorComponent,
      },
    ],
  },
];
