
export enum View {
  HOME = 'HOME',
  CONTACTS = 'CONTACTS',
  RESOURCES = 'RESOURCES',
  SETTINGS = 'SETTINGS',
  FAKE_CALL = 'FAKE_CALL',
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  enabled: boolean;
}

export interface Resource {
  name: string;
  address: string;
  phone: string;
}