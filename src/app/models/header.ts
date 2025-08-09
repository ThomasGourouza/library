import { SortDirection } from 'app/models/types';

export class Header {
  name: string;
  label: string;
  // TODO: icon
  labelMin: string;
  type: HeaderType;
  isVisible: boolean = true;
  isSelectAdd: boolean = false;
  sortDirection: SortDirection | null = null;
  rank: number = 0;

  constructor(name: string, label: string, labelMin: string,type: HeaderType) {
    this.name = name;
    this.label = label;
    this.labelMin = labelMin;
    this.type = type;
  }
}

export enum HeaderType {
  TEXT = 'text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ENUM = 'enum',
}
