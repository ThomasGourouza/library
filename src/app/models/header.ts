import { SortDirection } from "app/models/types";

export class Header {
  name: string;
  label: string;
  type: HeaderType;
  hasSelect: boolean;
  isVisible: boolean = true;
  isSelectAdd: boolean = false;
  sortDirection: SortDirection | null = null;
  rank: number = 0;

  constructor(
    name: string,
    label: string,
    type: HeaderType = HeaderType.TEXT,
    hasSelect: boolean = type === HeaderType.TEXT
  ) {
    this.name = name;
    this.label = label;
    this.type = type;
    this.hasSelect = hasSelect;
  }
}

export enum HeaderType {
  TEXT = 'text',
  NUMBER = 'number',
}
