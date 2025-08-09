import { SortDirection } from 'app/models/types';

// TODO
export class Header {
  name: string;
  label: string;
  type: HeaderType;
  hasBetween: boolean;
  hasSearch: boolean;
  hasSelect: boolean;
  isVisible: boolean = true;
  isSelectAdd: boolean = false;
  sortDirection: SortDirection | null = null;
  rank: number = 0;

  constructor(name: string, label: string, type: HeaderType) {
    this.name = name;
    this.label = label;
    this.type = type;
    this.hasBetween = type === HeaderType.NUMBER;
    this.hasSearch = [HeaderType.TEXT, HeaderType.ENUM].includes(type);
    this.hasSelect = [HeaderType.BOOLEAN, HeaderType.ENUM].includes(type);
  }

  // get hasBetween(): boolean {
  //   return this.type === HeaderType.NUMBER;
  // }

  // get hasSearch (): boolean {
  //   return [HeaderType.TEXT, HeaderType.ENUM].includes(this.type);
  // }

  // get hasSelect(): boolean {
  //   return [HeaderType.BOOLEAN, HeaderType.ENUM].includes(this.type);
  // }
}

export enum HeaderType {
  TEXT = 'text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ENUM = 'enum',
}
