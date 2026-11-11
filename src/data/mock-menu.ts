export interface MenuItem {
  id: string;
  name: string;
  category: 'Kafe' | 'Dezerty' | 'Snídaně' | 'Akce';
  price: number;
  description: string;
  fullDescription?: string;
  rating: number; // 1 to 5
  image: string;
  isPopular?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'espresso',
    name: 'Espresso',
    category: 'Kafe',
    price: 59,
    description: 'Velmi silná, intenzivní a hořkosladká',
    fullDescription: 'Klasické italské espresso připravené z výběrové 100% Arabiky. Vyniká plným tělem, bohatou cremou a tóny hořké čokolády a lískových oříšků.',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&q=80',
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    category: 'Kafe',
    price: 79,
    description: 'Vyvážená, krémová a mléčně nasládlá',
    fullDescription: 'Dokonalá harmonie intenzivního espressa a jemně našlehaného teplého mléka s hedvábnou mikropěnou navrchu.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&q=80',
  },
  {
    id: 'flat-white',
    name: 'Flat White',
    category: 'Kafe',
    price: 95,
    description: 'Výrazná kávová chuť s jemnou texturou',
    fullDescription: 'Dvojitá dávka espressa (double shot) zalitá jemnou mikropěnou. Pro ty, kteří chtějí výraznější chuť kávy než v cappuccinu.',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=500&q=80',
  },
  {
    id: 'latte-macchiato',
    name: 'Latte Macchiato',
    category: 'Kafe',
    price: 89,
    description: 'Velmi jemná, mléčná a slabší kávová chuť',
    fullDescription: 'Latte macchiato je oblíbený kávový nápoj, který vyniká svým vizuálním efektem tří dokonale oddělených vrstev mléka, espressa a husté pěny. Připravuje se pomalým vlitím čerstvého espressa do sklenice s teplým napěněným mlékem, kde káva díky své nižší hustotě zůstane uprostřed.',
    rating: 5,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1599398054066-846f28917f38?w=800&q=80',
  },
  {
    id: 'apple-crumble',
    name: 'Jablečný crumble',
    category: 'Dezerty',
    price: 115,
    description: 'Teplé pečené ovoce se skořicí pod křupavou máslovou drobenkou',
    fullDescription: 'Sezónní jablka pečená se skořicí, vanilkou a badyánem, přelitá štědrou vrstvou křupavé máslové drobenky s ovesnými vločkami.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&q=80',
  },
  {
    id: 'pumpkin-cheesecake',
    name: 'Dýňový cheesecake',
    category: 'Dezerty',
    price: 125,
    description: 'Křupavý korpus ze sušenek Lotus s krémovou náplní...',
    fullDescription: 'Křupavý korpus z karamelových sušenek Lotus doplněný jemnou krémovou vrstvou z mascarpone a pečené máslové dýně Hokaido s perníkovým kořením.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80',
  },
];
