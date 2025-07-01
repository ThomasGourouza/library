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
  of,
  shareReplay,
  startWith,
  tap,
} from 'rxjs';
import { FilterPipe } from '../pipes/filter.pipe';
import { AsyncPipe } from '@angular/common';
import { SortPipe } from '../pipes/sort.pipe';

export interface Book {
  id: string | null;
  title: string | null;
  author: string | null;
  year: string | null;
  genre: string | null;
  test: string | null;
}

export interface SortParams {
  sortColumn: string | null;
  sortDirection: string | null;
}

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterOutlet, TableComponent, AsyncPipe, FilterPipe, SortPipe],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent {
  books: Book[] = [];
  headers: Header[] = [];
  bookId$: Observable<string | null>;
  searchParams$: Observable<Book>;
  sortParams$: Observable<SortParams>;
  currentPage$: Observable<number> = of(1);

  private readonly paramMap$ = this.route.queryParamMap.pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

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

    this.currentPage$ = this.paramMap$.pipe(
      map((p) => +(p.get('page') ?? 1)),
      tap((page) => this.OnSelectedPage(page)),
      distinctUntilChanged()
    );

    this.searchParams$ = this.paramMap$.pipe(
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

    this.sortParams$ = this.paramMap$.pipe(
      tap((p) => {
        const isSortDirectionWrong = !['asc', 'desc'].includes(
          p.get('sortDirection') || ''
        );
        const isSortDirectionCaseWrong = ['asc', 'desc'].includes(
          p.get('sortDirection')?.toLocaleLowerCase() || ''
        );
        if (
          p.has('sortColumn') &&
          (!p.has('sortDirection') || isSortDirectionWrong)
        ) {
          const directionIfCaseWrong =
            p.get('sortDirection')?.toLocaleLowerCase() === 'asc'
              ? 'asc'
              : 'desc';
          const sortDirection = isSortDirectionCaseWrong
            ? directionIfCaseWrong
            : 'asc';
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { sortDirection },
            queryParamsHandling: 'merge',
          });
        }
        if (!p.has('sortColumn') && p.has('sortDirection')) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { sortColumn: 'title' },
            queryParamsHandling: 'merge',
          });
        }
      }),
      filter((p) => {
        const isNone = !p.has('sortColumn') && !p.has('sortDirection');
        const isBoth =
          p.has('sortColumn') &&
          ['asc', 'desc'].includes(p.get('sortDirection') || '');
        return isNone || isBoth;
      }),
      map((p) => ({
        sortColumn: p.get('sortColumn'),
        sortDirection: p.get('sortDirection'),
      })),
      distinctUntilChanged()
    );
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
