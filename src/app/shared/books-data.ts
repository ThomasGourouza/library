import { Book, BOOKS_HEADERS } from '@shared/constants';

const books = [
  { id: '1', title: 'Titre', author: 'Auteur', year: '1996', genre: 'Roman' },
  {
    id: '2',
    title: 'Titre 2',
    author: 'Auteur 2',
    year: '1856',
    genre: 'Poesie',
  },
  {
    id: '3',
    title: 'Titre 3',
    author: 'Auteur 3',
    year: '2007',
    genre: 'Essai',
  },
];

export const BOOKS: Book[] = books.map(toBook);

function toBook(book: any): Book {
  return Object.fromEntries(
    BOOKS_HEADERS.map(({ name }) => [name, book[name]])
  ) as unknown as Book;
}
