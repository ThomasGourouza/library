import { Header, HeaderNameBook, HeaderType } from "app/models/header";

export const BOOKS_HEADERS: Header[] = [
  new Header(HeaderNameBook.ORIGINAL_TITLE, 'Original title', 'book', HeaderType.TEXT),
  new Header(HeaderNameBook.TITLE, 'Translated title', 'translate', HeaderType.TEXT),
  new Header(HeaderNameBook.AUTHOR, 'Author name', 'person', HeaderType.TEXT),
  new Header(HeaderNameBook.PUBLICATION_DATE, 'Publication date', 'calendar', HeaderType.NUMBER),
  new Header(HeaderNameBook.LANGUAGE, 'Language', 'chat', HeaderType.ENUM),
  new Header(HeaderNameBook.TYPE, 'Type', 'tag', HeaderType.ENUM),
  new Header(HeaderNameBook.CATEGORY, 'Category', 'folder', HeaderType.ENUM),
  new Header(HeaderNameBook.AUDIENCE, 'Audience', 'people', HeaderType.ENUM),
  new Header(HeaderNameBook.STATUS, 'Status', 'check', HeaderType.ENUM),
  new Header(HeaderNameBook.FAVORITE, 'Favorite', 'star', HeaderType.BOOLEAN),
].map((header, index) => ({ ...header, rank: index + 1 }));
