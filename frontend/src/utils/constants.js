export const CATEGORIES = [
  { slug: 'women', label: "Women's Fashion", short: 'Women', path: '/women' },
  { slug: 'men', label: "Men's Fashion", short: 'Men', path: '/men' },
  { slug: 'beauty', label: 'Beauty', short: 'Beauty', path: '/beauty' },
  { slug: 'accessories', label: 'Accessories', short: 'Accessories', path: '/accessories' },
  { slug: 'home-living', label: 'Home & Living', short: 'Home & Living', path: '/home-living' },
];
export const categoryLabel = (slug) => CATEGORIES.find((c) => c.slug === slug)?.short || slug;
export const categoryPath = (slug) => CATEGORIES.find((c) => c.slug === slug)?.path || '/';

export const SORTS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'rating', label: 'Highest Rated' },
];

export const SIZE_ORDER = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38', '6', '7', '8', 'Double', 'King'];

export const COLOUR_HEX = {
  Maroon: '#7B1E2B', Black: '#161616', Blue: '#3C6FB5', Pink: '#E58FA3', Green: '#3E7B52', Yellow: '#F2C94C',
  Orange: '#EE8B3A', Grey: '#A8A8A8', White: '#FFFFFF', Beige: '#D9C3A3', Navy: '#1F3A63', Olive: '#6B6B2E',
  Red: '#C0392B', Gold: '#C9A24B', Silver: '#C0C0C0', 'Rose Gold': '#B76E79', Tan: '#B98B5E', Brown: '#7A5036', Teal: '#2C8C8C',
};
export const COLOUR_ORDER = Object.keys(COLOUR_HEX);
export const PAGE_SIZE = 12;
export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 79;
