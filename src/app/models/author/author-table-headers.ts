import { Header, HeaderType } from 'app/shared/constants';

export const AUTHORS_HEADERS: Header[] = [
  new Header('name', 'Name', HeaderType.TEXT, false),
  new Header('country', 'Country', HeaderType.TEXT, true),
  new Header('birthDate', 'Birth date'),
  new Header('deathDate', 'Death date'),
  new Header('deathAge', 'Death age'),
].map((header, index) => ({ ...header, rank: index + 1 }));
