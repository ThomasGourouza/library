import { Country } from "../enums";
import { Multilingual } from "../multilingual";

export interface AuthorCreate {
    name: string;
    country: Country;
    date: AuthorDate;
    description: Multilingual;
    wikipediaLink: string;
}

interface AuthorDate {
    birth: Date;
    death: Date | null;
}
