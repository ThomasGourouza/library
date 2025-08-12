import { SortDirection } from 'app/models/types';

export class Header {
  name: HeaderNameBook | HeaderNameAuthor;
  label: string;
  icon: string;
  type: HeaderType;
  isVisible: boolean = true;
  isSelectAdd: boolean = false;
  sortDirection: SortDirection | null = null;
  rank: number = 0;

  constructor(
    name: HeaderNameBook | HeaderNameAuthor,
    label: string,
    icon: string,
    type: HeaderType
  ) {
    this.name = name;
    this.label = label;
    this.icon = icon;
    this.type = type;
  }
}

export enum HeaderType {
  TEXT = 'text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ENUM = 'enum',
}

export enum HeaderNameBook {
  ORIGINAL_TITLE = 'originalTitle',
  TITLE = 'title',
  AUTHOR = 'author',
  PUBLICATION_DATE = 'publicationDate',
  LANGUAGE = 'language',
  TYPE = 'type',
  CATEGORY = 'category',
  AUDIENCE = 'audience',
  STATUS = 'status',
  FAVORITE = 'favorite',
}

export enum HeaderNameAuthor {
  NAME = 'name',
  COUNTRY = 'country',
  BIRTH_YEAR = 'birthYear',
  DEATH_YEAR = 'deathYear',
}
