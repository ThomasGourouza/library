import { Header, HeaderType } from "app/models/header";

export const AUTHORS_HEADERS: Header[] = [
  new Header('name', 'Name', 'person-card', HeaderType.TEXT),
  new Header('country', 'Country', 'flag', HeaderType.ENUM),
  new Header('birthYear', 'Birth year', 'calendar2', HeaderType.NUMBER),
  new Header('deathYear', 'Death year', 'calendar-x', HeaderType.NUMBER),
].map((header, index) => ({ ...header, rank: index + 1 }));
