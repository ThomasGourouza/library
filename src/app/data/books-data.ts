import { Book } from '@constants';

export const BOOKS: Book[] = [];

for (let i = 1; i <= 44; i++) {
  BOOKS.push({
    id: `Livre_${i}`,
    title: `Livre ${i}`,
    author: `Auteur ${i}`,
    year: `${2000 + (i % 20)}`,
    genre: ['Roman', 'Essai', 'Policier', 'SF', 'Poésie'][i % 5],
    test: 'test',
  });
}
