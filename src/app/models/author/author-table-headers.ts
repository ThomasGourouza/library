import { Header, HeaderType } from "app/models/header";

export const AUTHORS_HEADERS: Header[] = [
  new Header('name', 'Name', HeaderType.TEXT, false),
  new Header('country', 'Country', HeaderType.TEXT, true),
  new Header('birthYear', 'Birth year'),
  new Header('deathYear', 'Death year'),
  new Header('deathAge', 'Death age'),
].map((header, index) => ({ ...header, rank: index + 1 }));
