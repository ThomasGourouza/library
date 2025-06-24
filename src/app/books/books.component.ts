import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header, TableComponent } from '../table/table.component';

interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  test: string;
}

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterOutlet, TableComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent {
  books: Book[] = [];
  headers: Header[] = [];

  currentPage = 1;
  itemsPerPage = 15;

  constructor(private router: Router) {
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
  }

  get paginatedBooks(): Book[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.books.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.books.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  OnSelectedRow(row: any): void {
    console.log(row);
    this.router.navigate(['/books', row.id]);
  }
}
