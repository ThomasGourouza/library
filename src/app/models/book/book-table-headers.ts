import { Header, HeaderType } from "app/models/header";

export const BOOKS_HEADERS: Header[] = [
  new Header('originalTitle', 'Original title', 'book', HeaderType.TEXT),
  new Header('title', 'Translated title', 'translate', HeaderType.TEXT),
  new Header('author', 'Author name', 'person', HeaderType.TEXT),
  new Header('publicationDate', 'Publication date', 'calendar', HeaderType.NUMBER),
  new Header('language', 'Language', 'chat', HeaderType.ENUM),
  new Header('type', 'Type', 'tag', HeaderType.ENUM),
  new Header('category', 'Category', 'folder', HeaderType.ENUM),
  new Header('audience', 'Audience', 'people', HeaderType.ENUM),
  new Header('status', 'Status', 'check', HeaderType.ENUM),
  new Header('favorite', 'Favorite', 'star', HeaderType.BOOLEAN),
].map((header, index) => ({ ...header, rank: index + 1 }));
