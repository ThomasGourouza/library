import { Author } from '../author/author';
import { Multilingual } from '../multilingual';
import { Language, Category, Audience, Status, Type } from '../enums';

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
