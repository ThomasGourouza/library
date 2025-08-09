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
