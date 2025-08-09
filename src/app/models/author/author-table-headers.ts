import { Header, HeaderType } from "app/models/header";

export const AUTHORS_HEADERS: Header[] = [
  new Header('name', 'Name', HeaderType.TEXT, true, false),
  new Header('country', 'Country'),
  new Header('birthYear', 'Birth year'),
  new Header('deathYear', 'Death year'),
  new Header('deathAge', 'Death age'),
].map((header, index) => ({ ...header, rank: index + 1 }));
