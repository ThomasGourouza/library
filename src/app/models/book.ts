import { Author } from './author';
import { Multilingual } from './multilingual';
import { Language, Category, Audience, Status, Type } from './enums';
import { HeaderType } from '@shared/constants';

export interface Book {
  id: string;
  originalTitle: string;
  title: Multilingual;
  author: Author;
  authorAgeAtPublication: number;
  publicationDate: Date;
  language: Language;
  type: Type;
  category: Category;
  audience: Audience;
  description: Multilingual;
  wikipediaLink: string;
  status: Status;
  favorite: boolean;
  personalNotes: string;
}

type Header = {
  name: keyof Book;
  label: string;
  type: HeaderType;
  isVisible: boolean;
  hasSelect: boolean;
  isSelectAdd: boolean;
  sortDirection: 'asc' | 'desc' | null;
  rank: number;
};

// export const BOOKS_HEADERS: Header[] = [
export const BOOKS_HEADERS = [
  {
    name: 'originalTitle',
    label: 'Original Title',
    type: HeaderType.TEXT,
    isVisible: true,
    hasSelect: false,
    isSelectAdd: false,
    sortDirection: null,
    rank: 1,
  },
  {
    name: 'title',
    label: 'Translated Title',
    type: HeaderType.TEXT,
    isVisible: true,
    hasSelect: false,
    isSelectAdd: false,
    sortDirection: null,
    rank: 2,
  },
  {
    name: 'author',
    label: 'Author',
    type: HeaderType.TEXT,
    isVisible: true,
    hasSelect: true,
    isSelectAdd: false,
    sortDirection: null,
    rank: 3,
  },
  {
    name: 'publicationDate',
    label: 'Publication Date',
    type: HeaderType.NUMBER,
    isVisible: true,
    hasSelect: false,
    isSelectAdd: false,
    sortDirection: null,
    rank: 4,
  },
  {
    name: 'language',
    label: 'Language',
    type: HeaderType.TEXT,
    isVisible: true,
    hasSelect: true,
    isSelectAdd: false,
    sortDirection: null,
    rank: 5,
  },
  {
    name: 'type',
    label: 'Type',
    type: HeaderType.TEXT,
    isVisible: true,
    hasSelect: true,
    isSelectAdd: false,
    sortDirection: null,
    rank: 6,
  },
  {
    name: 'category',
    label: 'Category',
    type: HeaderType.TEXT,
    isVisible: true,
    hasSelect: true,
    isSelectAdd: false,
    sortDirection: null,
    rank: 7,
  },
  {
    name: 'audience',
    label: 'Audience',
    type: HeaderType.TEXT,
    isVisible: true,
    hasSelect: true,
    isSelectAdd: false,
    sortDirection: null,
    rank: 8,
  },
  {
    name: 'status',
    label: 'Status',
    type: HeaderType.TEXT,
    isVisible: true,
    hasSelect: true,
    isSelectAdd: false,
    sortDirection: null,
    rank: 9,
  },
  {
    name: 'favorite',
    label: 'Favorite',
    type: HeaderType.TEXT,
    isVisible: true,
    hasSelect: true,
    isSelectAdd: false,
    sortDirection: null,
    rank: 10,
  }
];
