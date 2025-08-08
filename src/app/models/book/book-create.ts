import { Language, Category, Audience, Status, Type } from "../enums";
import { Multilingual } from "../multilingual";

export interface BookCreate {
  originalTitle: string;
  title: Multilingual;
  authorId: string;
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
