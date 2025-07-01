import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Header, TableComponent } from '../table/table.component';
import { distinctUntilChanged, map, Subject, Subscription, tap } from 'rxjs';

interface Book {
  id: string | null;
  title: string | null;
  author: string | null;
  year: number | null;
  genre: string | null;
  test: string | null;
}

interface SearchParams extends Book {
  page: number;
}

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterOutlet, TableComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent implements OnDestroy {
  books: Book[] = [];
  headers: Header[] = [];
  bookId: string | null = null;
  searchParams: SearchParams = {
    id: null,
    title: null,
    author: null,
    year: null,
    genre: null,
    test: null,
    page: 1,
  };
  urlSubscription: Subscription | null = null;
  queryParamsSubscription: Subscription | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {
    for (let i = 1; i <= 44; i++) {
      this.books.push({
        id: `Livre_${i}`,
        title: `Livre ${i}`,
        author: `Auteur ${i}`,
        year: 2000 + (i % 20),
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

    this.urlSubscription = this.router.events.subscribe(() => {
      const urlSegments = this.router.url.split('?')[0]?.split('/');
      const newBookId = urlSegments.length === 3 ? urlSegments[2] : null;
      if (newBookId !== this.bookId) {
        this.bookId = newBookId;
      }
    });
    this.queryParamsSubscription = this.route.queryParamMap
      .pipe(
        map((p) => {
          const year = p.get('year');
          const page = p.get('page');
          return {
            id: p.get('id'),
            title: p.get('title'),
            author: p.get('author'),
            year: year ? +year : null,
            genre: p.get('genre'),
            test: p.get('test'),
            page: page ? +page : 1,
          };
        }),
        distinctUntilChanged()
      )
      .subscribe(
        (searchParams: SearchParams) => (this.searchParams = searchParams)
      );
    this.OnSelectedPage(this.searchParams.page);
  }

  ngOnDestroy(): void {
    this.urlSubscription?.unsubscribe();
    this.queryParamsSubscription?.unsubscribe();
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
