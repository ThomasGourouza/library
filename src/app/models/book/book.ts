import { Author } from '../author/author';
import { Audience, Category, Language, Status, Type } from '../enums';
import { Multilingual } from '../multilingual';

export interface Book {
  id: string;
  originalTitle: string;
  title: Multilingual;
  author: Author;
  authorAgeAtPublication: number;
  publicationDate: Date;
  language: Language | string;
  type: Type | string;
  category: Category | string;
  audience: Audience | string;
  description: Multilingual;
  wikipediaLink: string;
  status: Status | string;
  favorite: boolean;
  personalNotes: string;
}
