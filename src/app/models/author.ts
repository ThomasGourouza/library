import { Book } from "./book";
import { Country } from "./enums";
import { Multilingual } from "./multilingual";

export interface Author {
    id: string;
    name: string;
    country: Country;
    date: AuthorDate;
    description: Multilingual;
    wikipediaLink: string;
    books: Book[];
}

interface AuthorDate {
    birth: Date;
    death: Date | null;
}
