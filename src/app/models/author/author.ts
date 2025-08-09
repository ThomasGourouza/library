import { Book } from "../book/book";
import { Country } from "../enums";
import { Multilingual } from "../multilingual";

export interface Author {
    id: string;
    name: string;
    country: Country | string;
    date: AuthorDate;
    description: Multilingual;
    wikipediaLink: string;
    books: Book[] | null;
}

export interface AuthorDate {
    birth: Date;
    death: Date | null;
}
