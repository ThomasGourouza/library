import { Routes } from '@angular/router';
import { AuthorsComponent } from 'app/components/authors/authors.component';
import { AuthorComponent } from 'app/components/authors/author/author.component';
import { ROW_ID } from '@shared/constants';

export const routes: Routes = [
  {
    path: '',
    component: AuthorsComponent,
    children: [
      {
        path: `:${ROW_ID}`,
        component: AuthorComponent,
      },
    ],
  },
];
