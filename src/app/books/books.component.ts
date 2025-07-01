import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { Header, TableComponent } from '../table/table.component';
import {
  distinctUntilChanged,
  filter,
  map,
  Observable,
  startWith,
  tap,
} from 'rxjs';
import { FilterPipe } from '../pipes/filter.pipe';
import { AsyncPipe } from '@angular/common';

export interface Book {
  id: string | null;
  title: string | null;
  author: string | null;
  year: string | null;
  genre: string | null;
  test: string | null;
}

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterOutlet, TableComponent, AsyncPipe, FilterPipe],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent {
  books: Book[] = [];
  headers: Header[] = [];
  bookId$: Observable<string | null>;
  searchParams$: Observable<Book>;
  currentPage = 1;

  constructor(private router: Router, private route: ActivatedRoute) {
    for (let i = 1; i <= 44; i++) {
      this.books.push({
        id: `Livre_${i}`,
        title: `Livre ${i}`,
        author: `Auteur ${i}`,
        year: `${2000 + (i % 20)}`,
        genre: ['Roman', 'Essai', 'Policier', 'SF', 'Poésie'][i % 5],
        test: 'test',
      });
    }
    this.headers = [
      { name: 'title', label: 'Titre' },
      { name: 'author', label: 'Auteur' },
      { name: 'year', label: 'Année' },
      { name: 'genre', label: 'Genre' },
      { name: 'test', label: 'Test' },
    ];

    this.bookId$ = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      startWith({ urlAfterRedirects: this.router.url } as NavigationEnd),
      map(({ urlAfterRedirects }) => {
        const urlSegments = urlAfterRedirects.split('?')[0].split('/');
        return urlSegments.length === 3 ? urlSegments[2] : null;
      }),
      distinctUntilChanged()
    );

    this.searchParams$ = this.route.queryParamMap.pipe(
      tap((p) => {
        const page = p.get('page');
        this.currentPage = page ? +page : 1;
      }),
      map((p) => ({
        id: p.get('id'),
        title: p.get('title'),
        author: p.get('author'),
        year: p.get('year'),
        genre: p.get('genre'),
        test: p.get('test'),
      })),
      distinctUntilChanged()
    );
    this.OnSelectedPage(this.currentPage);
  }

  OnSelectedRow(rowId: string): void {
    this.router.navigate(['/books', rowId], {
      queryParamsHandling: 'preserve',
    });
  }

  OnSelectedPage(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }
}
