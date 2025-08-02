import { Routes } from '@angular/router';
import { ROW_ID } from '@shared/constants';
import { AuthorDetailComponent } from 'app/components/authors/author-detail/author-detail.component';
import { AuthorsComponent } from 'app/components/authors/authors.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthorsComponent,
    children: [
      {
        path: `:${ROW_ID}`,
        component: AuthorDetailComponent,
      },
    ],
  },
];
