import { Header, HeaderType } from "app/models/header";

export const BOOKS_HEADERS: Header[] = [
  new Header('originalTitle', 'Original Title', HeaderType.TEXT),
  new Header('title', 'Translated Title', HeaderType.TEXT),
  new Header('author', 'Author', HeaderType.TEXT),
  new Header('publicationDate', 'Publication Date', HeaderType.NUMBER),
  new Header('language', 'Language', HeaderType.ENUM),
  new Header('type', 'Type', HeaderType.ENUM),
  new Header('category', 'Category', HeaderType.ENUM),
  new Header('audience', 'Audience', HeaderType.ENUM),
  new Header('status', 'Status', HeaderType.ENUM),
  new Header('favorite', 'Favorite', HeaderType.BOOLEAN),
].map((header, index) => ({ ...header, rank: index + 1 }));
