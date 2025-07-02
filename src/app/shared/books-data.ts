import { Book, BOOKS_HEADERS } from '@shared/constants';

const books = [
  { title: 'Titre', author: 'Auteur', year: '1996', genre: 'Roman' },
  {
    title: 'Titre 2',
    author: 'Auteur 2',
    year: '1856',
    genre: 'Poesie',
  },
  {
    title: 'Titre 3',
    author: 'Auteur 3',
    year: '2007',
    genre: 'Essai',
  },
  {
    title: 'Café#42',
    author: 'Auteur 4',
    year: '2007',
    genre: 'Essai',
  },
];

export const BOOKS: Book[] = books.map(toBook);

function toBook(book: any): Book {
  return Object.fromEntries([
    ['id', makeId(book['title'])],
    ...BOOKS_HEADERS.map(({ name }) => [name, book[name]]),
  ]) as unknown as Book;
}

/**
 * Transforme un titre en identifiant « slug » :
 *   • minuscules
 *   • accents supprimés
 *   • espaces & apostrophes ⇒ _ (underscore)
 *   • caractères spéciaux supprimés
 */
function makeId(title: string): string {
  return title
    .normalize('NFD') // sépare les accents
    .replace(/[\u0300-\u036f]/g, '') // supprime les accents
    .toLowerCase()
    .replace(/['\s]+/g, '_') // espaces & apostrophes: _
    .replace(/[^a-z0-9_]/g, ''); // retire le reste
}
