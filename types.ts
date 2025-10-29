export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ShoppingSession {
  id:string;
  date: string;
  items: Product[];
  total: number;
}

export type Theme = 'light' | 'dark' | 'amoled' | 'system';

export interface Settings {
  theme: Theme;
  mealVoucherValue: number;
  accentColor: string;
}

export type View = 'new' | 'history' | 'settings';