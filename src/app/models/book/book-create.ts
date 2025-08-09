import { Audience, Category, Language, Status, Type } from "../enums";
import { Multilingual } from "../multilingual";

export interface BookCreate {
  originalTitle: string;
  title: Multilingual;
  authorId: string;
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
