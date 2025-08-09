import { Header, HeaderType } from "app/models/header";

export const AUTHORS_HEADERS: Header[] = [
  new Header('name', 'Name', 'Name', HeaderType.TEXT),
  new Header('country', 'Country', 'Country', HeaderType.ENUM),
  new Header('birthYear', 'Birth year', 'Birth year', HeaderType.NUMBER),
  new Header('deathYear', 'Death year', 'Death year', HeaderType.NUMBER),
  new Header('deathAge', 'Death age', 'Death age', HeaderType.NUMBER),
].map((header, index) => ({ ...header, rank: index + 1 }));
