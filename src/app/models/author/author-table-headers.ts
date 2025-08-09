import { Header, HeaderType } from "app/models/header";

export const AUTHORS_HEADERS: Header[] = [
  new Header('name', 'Name', HeaderType.TEXT),
  new Header('country', 'Country', HeaderType.ENUM),
  new Header('birthYear', 'Birth year', HeaderType.NUMBER),
  new Header('deathYear', 'Death year', HeaderType.NUMBER),
  new Header('deathAge', 'Death age', HeaderType.NUMBER),
].map((header, index) => ({ ...header, rank: index + 1 }));
