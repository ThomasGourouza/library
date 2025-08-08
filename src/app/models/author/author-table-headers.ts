import { Header, HeaderType } from 'app/shared/constants';

export const AUTHORS_HEADERS: Header[] = [
  {
    name: 'name',
    label: 'Name',
    type: HeaderType.TEXT,
    isVisible: true,
    hasSelect: true,
    isSelectAdd: false,
    sortDirection: null,
    rank: 1,
  },
  {
    name: 'country',
    label: 'Country',
    type: HeaderType.TEXT,
    isVisible: true,
    hasSelect: true,
    isSelectAdd: true,
    sortDirection: null,
    rank: 2,
  },
  {
    name: 'date',
    label: 'Date',
    type: HeaderType.TEXT,
    isVisible: true,
    hasSelect: true,
    isSelectAdd: false,
    sortDirection: null,
    rank: 3,
  }
];
