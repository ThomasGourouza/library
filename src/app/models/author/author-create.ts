import { Country } from "../enums";
import { Multilingual } from "../multilingual";
import { AuthorDate } from "./Author";

export interface AuthorCreate {
    name: string;
    country: Country;
    date: AuthorDate;
    description: Multilingual;
    wikipediaLink: string;
}
