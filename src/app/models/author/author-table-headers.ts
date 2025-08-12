import { Header, HeaderNameAuthor, HeaderType } from "app/models/header";

export const AUTHORS_HEADERS: Header[] = [
  new Header(HeaderNameAuthor.NAME, 'Name', 'person-card', HeaderType.TEXT),
  new Header(HeaderNameAuthor.COUNTRY, 'Country', 'flag', HeaderType.ENUM),
  new Header(HeaderNameAuthor.BIRTH_YEAR, 'Birth year', 'calendar2', HeaderType.NUMBER),
  new Header(HeaderNameAuthor.DEATH_YEAR, 'Death year', 'calendar-x', HeaderType.NUMBER),
].map((header, index) => ({ ...header, rank: index + 1 }));
