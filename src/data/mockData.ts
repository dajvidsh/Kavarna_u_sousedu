export type MenuCategory = 'Kafe' | 'Dezerty' | 'Snídaně' | 'Akce';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  rating: number;
  image: string;
}

export interface CafeLocation {
  id: string;
  name: string;
  description: string;
  address: string;
}

export interface UserProfile {
  name: string;
  email: string;
  cardNumber: string;
  currentPoints: number;
  totalPoints: number;
  lastPurchase: {
    date: string;
    location: string;
    summary: string;
    pointsEarned: number;
  };
}

export const USER_DATA: UserProfile = {
  name: 'Anna Nováková',
  email: 'annanov13@seznam.cz',
  cardNumber: '00132034/28',
  currentPoints: 4,
  totalPoints: 10,
  lastPurchase: {
    date: 'Dnes',
    location: 'Údolní',
    summary: '1 nákup (2 kávy)',
    pointsEarned: 2,
  },
};

export const MENU_ITEMS: MenuItem[] = [
  { id: '1', name: 'Espresso', description: 'Velmi silná, intenzivní a hořkosladká', price: 59, category: 'Kafe', rating: 4, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=300' },
  { id: '2', name: 'Cappuccino', description: 'Vyvážená, krémová a mléčně nasládlá', price: 79, category: 'Kafe', rating: 5, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=300' },
  { id: '3', name: 'Flat White', description: 'Výrazná kávová chuť s jemnou texturou', price: 95, category: 'Kafe', rating: 4, image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=300' },
  { id: '4', name: 'Latte Macchiato', description: 'Velmi jemná, mléčná a slabší kávová chuť', price: 89, category: 'Kafe', rating: 5, image: 'https://images.unsplash.com/photo-1593443320739-77f74939d0da?q=80&w=300' },
  { id: '5', name: 'Jablečný crumble', description: 'Teplé pečené ovoce se skořicí pod křupavou máslovou drobenkou.', price: 115, category: 'Dezerty', rating: 5, image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?q=80&w=300' },
  { id: '6', name: 'Dýňový cheesecake', description: 'Křupavý korpus ze sušenek Lotus s krémovou náplní.', price: 125, category: 'Dezerty', rating: 5, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=300' },
];

export const CAFES: CafeLocation[] = [
  { id: '1', name: 'Údolní', description: 'Velmi oblíbená brněnská kavárna s krásnou zahrádkou ve vnitrobloku, kousek od centra pod Špilberkem.', address: 'Údolní 222/5, 602 00 Brno-střed' },
  { id: '2', name: 'Jakubská', description: 'Menší, ale velmi oblíbený a výborně hodnocený espresso bar přímo v centru města, který ocení především milovníci špičkové výběrové kávy.', address: 'Jakubská 5, 602 00 Brno-střed' },
  { id: '3', name: 'Letohradská', description: 'Nádherná kavárna kousek od Letenského náměstí, která zaujme svými oloupanými zdmi, velkými okny a útulným prostředím.', address: 'Letohradská 44, 170 00 Praha 7 - Holešovice' },
];
