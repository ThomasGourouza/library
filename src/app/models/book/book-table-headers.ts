import { Header, HeaderType } from "app/models/header";

export const BOOKS_HEADERS: Header[] = [
  new Header('originalTitle', 'Original Title', HeaderType.TEXT, true, false),
  new Header('title', 'Translated Title', HeaderType.TEXT, true, false),
  new Header('author', 'Author'),
  new Header('publicationDate', 'Publication Date', HeaderType.NUMBER),
  new Header('language', 'Language'),
  new Header('type', 'Type'),
  new Header('category', 'Category'),
  new Header('audience', 'Audience'),
  new Header('status', 'Status'),
  new Header('favorite', 'Favorite', HeaderType.BOOLEAN),
].map((header, index) => ({ ...header, rank: index + 1 }));
