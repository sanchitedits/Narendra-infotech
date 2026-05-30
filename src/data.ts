import { Product, Category } from './types';

export const products: Product[] = [
  { 
    id: 1, 
    name: 'Amazon Fire TV Stick', 
    price: '₹3,999',
    vendor: 'Amazon',
    tags: '4K, streaming, fire tv, smart tv',
    category: 'Streaming Devices', 
    rating: 5, 
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&q=80',
    description: 'Our most powerful streaming stick. Dive into 4K Ultra HD cinematic entertainment with a new quad-core 1.8 GHz processor that brings a 40% more powerful experience compared to Fire TV Stick 4K, plus faster app starts and more fluid navigation.',
    specifications: {
      'Resolution': 'Up to 4K Ultra HD',
      'Processor': 'Quad-core 1.8 GHz',
      'Storage': '8 GB',
      'Audio': 'Dolby Atmos, 7.1 surround sound, 2-channel stereo, and HDMI audio pass-through up to 5.1.',
      'Wi-Fi': 'Wi-Fi 6 (802.11ax)',
    },
    inTheBox: ['Fire TV Stick 4K Max', 'Alexa Voice Remote (3rd Gen)', 'USB cable and power adapter', 'HDMI extender cable', '2 AAA batteries', 'Quick Start Guide']
  },
  { 
    id: 2, 
    name: 'Windows 11 Pro License Key', 
    price: '₹14,999', 
    vendor: 'Microsoft',
    tags: 'software, os, windows, license',
    category: 'Digital Assets', 
    rating: 5, 
    image: 'https://placehold.co/600x600/e2e8f0/111827?text=Windows+11+Pro',
    description: 'Instant delivery Windows 11 Pro license key for pristine activation. Comes with latest security patches and features.',
    specifications: {
      'Delivery': 'Instant Email Delivery',
      'Type': 'Digital License',
      'Architecture': '64-bit',
      'Validity': 'Lifetime',
    },
    inTheBox: ['Digital Serial Key (Sent via Email)']
  },
];

export const seedVariants = [
    {
        productId: 1,
        title: 'Fire TV Stick 4K',
        sku: 'AMZ-FTV-4K',
        price: '3999.00',
        compareAtPrice: '4999.00',
        inventoryManagement: true,
        inventoryQuantity: 50,
        requiresShipping: true,
        imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&q=80',
    },
    {
        productId: 1,
        title: 'Fire TV Stick 4K Max',
        sku: 'AMZ-FTV-MAX',
        price: '5999.00',
        compareAtPrice: '6999.00',
        inventoryManagement: true,
        inventoryQuantity: 25,
        requiresShipping: true,
        imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&q=80',
    },
    {
        productId: 2,
        title: 'Digital Key (Lifetime)',
        sku: 'MS-WIN11-PRO',
        price: '14999.00',
        compareAtPrice: null,
        inventoryManagement: false,
        inventoryQuantity: 100,
        requiresShipping: false,
        imageUrl: 'https://placehold.co/600x600/e2e8f0/111827?text=Windows+11+Pro',
    }
];

export const seedDigitalAssets = [
    {
        serialCode: 'WIN11-ABCD-1234-EFGH-5678',
        fileUrl: null,
        isDispatched: false,
        variantIndex: 2 // points to Windows 11 Pro variant
    },
    {
        serialCode: 'WIN11-ZZZZ-XXXX-YYYY-WWWW',
        fileUrl: null,
        isDispatched: false,
        variantIndex: 2 // points to Windows 11 Pro variant
    }
];

export const categories: Category[] = [
  { name: 'Streaming Devices', count: '4 Products' },
  { name: 'Accessories', count: '12 Products' },
  { name: 'Digital Assets', count: '5 Products' },
  { name: 'Audio Systems', count: '15 Products' },
];
