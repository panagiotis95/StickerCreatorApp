
export interface Sticker {
  id: string;
  url: string;
  prompt: string;
  price: number;
}

export interface CartItem extends Sticker {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  orders: string[];
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export enum Page {
  Home = 'home',
  StickerCreator = 'creator',
  VideoGenerator = 'video',
  Chat = 'chat',
  About = 'about',
  Contact = 'contact',
  Cart = 'cart',
  Account = 'account'
}
