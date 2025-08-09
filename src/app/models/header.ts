import { SortDirection } from 'app/models/types';

export class Header {
  name: string;
  label: string;
  type: HeaderType;
  hasSearch: boolean;
  hasSelect: boolean;
  isVisible: boolean = true;
  isSelectAdd: boolean = false;
  sortDirection: SortDirection | null = null;
  rank: number = 0;

  constructor(
    name: string,
    label: string,
    type: HeaderType = HeaderType.TEXT,
    hasSearch: boolean = type === HeaderType.TEXT,
    hasSelect: boolean = [HeaderType.TEXT, HeaderType.BOOLEAN].includes(type)
  ) {
    this.name = name;
    this.label = label;
    this.type = type;
    this.hasSearch = hasSearch;
    this.hasSelect = hasSelect;
  }
}

export enum HeaderType {
  TEXT = 'text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ENUM = 'enum',
}
