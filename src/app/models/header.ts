import { SortDirection } from 'app/models/types';

export class Header {
  name: string;
  label: string;
  icon: string;
  type: HeaderType;
  isVisible: boolean = true;
  isSelectAdd: boolean = false;
  sortDirection: SortDirection | null = null;
  rank: number = 0;

  constructor(name: string, label: string, icon: string,type: HeaderType) {
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
