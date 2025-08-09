import { Header, HeaderType } from "app/models/header";

export const BOOKS_HEADERS: Header[] = [
  new Header('originalTitle', 'Original title', 'Title', HeaderType.TEXT),
  new Header('title', 'Translated title', 'Trans.', HeaderType.TEXT),
  new Header('author', 'Author name', 'Auth.', HeaderType.TEXT),
  new Header('publicationDate', 'Publication date', 'Date', HeaderType.NUMBER),
  new Header('language', 'Language', 'Lang.', HeaderType.ENUM),
  new Header('type', 'Type', 'Type', HeaderType.ENUM),
  new Header('category', 'Category', 'Cat.', HeaderType.ENUM),
  new Header('audience', 'Audience', 'Aud.', HeaderType.ENUM),
  new Header('status', 'Status', 'Stat.', HeaderType.ENUM),
  new Header('favorite', 'Favorite', 'Fav.', HeaderType.BOOLEAN),
].map((header, index) => ({ ...header, rank: index + 1 }));
