import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  currencyName: string;
  exchangeRate: number; // 1 USD = exchangeRate in this currency
  phoneCode: string;
  addressFormat: {
    stateLabel: string;
    zipLabel: string;
    zipPlaceholder: string;
    sampleCity: string;
    sampleState: string;
    sampleZip: string;
  };
}

export const COUNTRIES: CountryConfig[] = [
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    currencySymbol: '₹',
    currencyName: 'Indian Rupee',
    exchangeRate: 86.5,
    phoneCode: '+91',
    addressFormat: {
      stateLabel: 'State / Union Territory',
      zipLabel: 'PIN Code (6 digits)',
      zipPlaceholder: 'e.g. 560001, 110001, 600001',
      sampleCity: 'Bengaluru',
      sampleState: 'Karnataka',
      sampleZip: '560038',
    },
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    currencyName: 'US Dollar',
    exchangeRate: 1.0,
    phoneCode: '+1',
    addressFormat: {
      stateLabel: 'State',
      zipLabel: 'ZIP Code (5 digits)',
      zipPlaceholder: 'e.g. 98101, 94102, 10001',
      sampleCity: 'San Francisco',
      sampleState: 'CA',
      sampleZip: '94102',
    },
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    currencyName: 'British Pound',
    exchangeRate: 0.79,
    phoneCode: '+44',
    addressFormat: {
      stateLabel: 'County / Region',
      zipLabel: 'Postcode',
      zipPlaceholder: 'e.g. SW1A 1AA, EC1A 1BB',
      sampleCity: 'London',
      sampleState: 'Greater London',
      sampleZip: 'SW1A 1AA',
    },
  },
  {
    code: 'DE',
    name: 'Germany (Eurozone)',
    flag: '🇩🇪',
    currency: 'EUR',
    currencySymbol: '€',
    currencyName: 'Euro',
    exchangeRate: 0.92,
    phoneCode: '+49',
    addressFormat: {
      stateLabel: 'State (Bundesland)',
      zipLabel: 'Postal Code (PLZ)',
      zipPlaceholder: 'e.g. 10115, 80331',
      sampleCity: 'Berlin',
      sampleState: 'Berlin',
      sampleZip: '10115',
    },
  },
  {
    code: 'FR',
    name: 'France (Eurozone)',
    flag: '🇫🇷',
    currency: 'EUR',
    currencySymbol: '€',
    currencyName: 'Euro',
    exchangeRate: 0.92,
    phoneCode: '+33',
    addressFormat: {
      stateLabel: 'Region / Department',
      zipLabel: 'Code Postal',
      zipPlaceholder: 'e.g. 75001, 69001',
      sampleCity: 'Paris',
      sampleState: 'Île-de-France',
      sampleZip: '75001',
    },
  },
  {
    code: 'ES',
    name: 'Spain (Eurozone)',
    flag: '🇪🇸',
    currency: 'EUR',
    currencySymbol: '€',
    currencyName: 'Euro',
    exchangeRate: 0.92,
    phoneCode: '+34',
    addressFormat: {
      stateLabel: 'Province',
      zipLabel: 'Postal Code',
      zipPlaceholder: 'e.g. 28001, 08001',
      sampleCity: 'Madrid',
      sampleState: 'Madrid',
      sampleZip: '28001',
    },
  },
  {
    code: 'IT',
    name: 'Italy (Eurozone)',
    flag: '🇮🇹',
    currency: 'EUR',
    currencySymbol: '€',
    currencyName: 'Euro',
    exchangeRate: 0.92,
    phoneCode: '+39',
    addressFormat: {
      stateLabel: 'Province',
      zipLabel: 'CAP / Postal Code',
      zipPlaceholder: 'e.g. 00118, 20121',
      sampleCity: 'Rome',
      sampleState: 'Lazio',
      sampleZip: '00118',
    },
  },
  {
    code: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    currency: 'JPY',
    currencySymbol: '¥',
    currencyName: 'Japanese Yen',
    exchangeRate: 154.0,
    phoneCode: '+81',
    addressFormat: {
      stateLabel: 'Prefecture',
      zipLabel: 'Postal Code (7 digits)',
      zipPlaceholder: 'e.g. 100-0001, 150-0001',
      sampleCity: 'Tokyo',
      sampleState: 'Tokyo Prefecture',
      sampleZip: '100-0001',
    },
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    currencySymbol: 'AED ',
    currencyName: 'UAE Dirham',
    exchangeRate: 3.67,
    phoneCode: '+971',
    addressFormat: {
      stateLabel: 'Emirate',
      zipLabel: 'Postal / Makani Number',
      zipPlaceholder: 'e.g. 00000, 12345',
      sampleCity: 'Dubai',
      sampleState: 'Dubai Emirate',
      sampleZip: '00000',
    },
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    currency: 'SAR',
    currencySymbol: 'SAR ',
    currencyName: 'Saudi Riyal',
    exchangeRate: 3.75,
    phoneCode: '+966',
    addressFormat: {
      stateLabel: 'Province / Region',
      zipLabel: 'Postal Code',
      zipPlaceholder: 'e.g. 11564, 21442',
      sampleCity: 'Riyadh',
      sampleState: 'Riyadh Province',
      sampleZip: '11564',
    },
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    currencySymbol: 'C$',
    currencyName: 'Canadian Dollar',
    exchangeRate: 1.38,
    phoneCode: '+1',
    addressFormat: {
      stateLabel: 'Province / Territory',
      zipLabel: 'Postal Code',
      zipPlaceholder: 'e.g. M5V 2T6, V6B 1A1',
      sampleCity: 'Toronto',
      sampleState: 'Ontario',
      sampleZip: 'M5V 2T6',
    },
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    currencySymbol: 'A$',
    currencyName: 'Australian Dollar',
    exchangeRate: 1.55,
    phoneCode: '+61',
    addressFormat: {
      stateLabel: 'State / Territory',
      zipLabel: 'Postcode (4 digits)',
      zipPlaceholder: 'e.g. 2000, 3000, 4000',
      sampleCity: 'Sydney',
      sampleState: 'NSW',
      sampleZip: '2000',
    },
  },
  {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    currencySymbol: 'S$',
    currencyName: 'Singapore Dollar',
    exchangeRate: 1.35,
    phoneCode: '+65',
    addressFormat: {
      stateLabel: 'Region / Area',
      zipLabel: 'Postal Code (6 digits)',
      zipPlaceholder: 'e.g. 018956, 238839',
      sampleCity: 'Singapore',
      sampleState: 'Central',
      sampleZip: '018956',
    },
  },
  {
    code: 'CH',
    name: 'Switzerland',
    flag: '🇨🇭',
    currency: 'CHF',
    currencySymbol: 'CHF ',
    currencyName: 'Swiss Franc',
    exchangeRate: 0.88,
    phoneCode: '+41',
    addressFormat: {
      stateLabel: 'Canton',
      zipLabel: 'Postal Code (PLZ)',
      zipPlaceholder: 'e.g. 8001, 1201',
      sampleCity: 'Zurich',
      sampleState: 'Zurich',
      sampleZip: '8001',
    },
  },
  {
    code: 'BR',
    name: 'Brazil',
    flag: '🇧🇷',
    currency: 'BRL',
    currencySymbol: 'R$',
    currencyName: 'Brazilian Real',
    exchangeRate: 5.70,
    phoneCode: '+55',
    addressFormat: {
      stateLabel: 'State (Estado)',
      zipLabel: 'CEP / Postal Code',
      zipPlaceholder: 'e.g. 01310-100',
      sampleCity: 'São Paulo',
      sampleState: 'SP',
      sampleZip: '01310-100',
    },
  },
  {
    code: 'KR',
    name: 'South Korea',
    flag: '🇰🇷',
    currency: 'KRW',
    currencySymbol: '₩',
    currencyName: 'South Korean Won',
    exchangeRate: 1390.0,
    phoneCode: '+82',
    addressFormat: {
      stateLabel: 'Province / Special City',
      zipLabel: 'Postal Code (5 digits)',
      zipPlaceholder: 'e.g. 03086, 06000',
      sampleCity: 'Seoul',
      sampleState: 'Seoul',
      sampleZip: '03086',
    },
  },
  {
    code: 'MX',
    name: 'Mexico',
    flag: '🇲🇽',
    currency: 'MXN',
    currencySymbol: 'Mex$',
    currencyName: 'Mexican Peso',
    exchangeRate: 20.2,
    phoneCode: '+52',
    addressFormat: {
      stateLabel: 'State (Estado)',
      zipLabel: 'Código Postal',
      zipPlaceholder: 'e.g. 06600, 44100',
      sampleCity: 'Mexico City',
      sampleState: 'CDMX',
      sampleZip: '06600',
    },
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    flag: '🇳🇿',
    currency: 'NZD',
    currencySymbol: 'NZ$',
    currencyName: 'New Zealand Dollar',
    exchangeRate: 1.68,
    phoneCode: '+64',
    addressFormat: {
      stateLabel: 'Region',
      zipLabel: 'Postcode',
      zipPlaceholder: 'e.g. 1010, 6011',
      sampleCity: 'Auckland',
      sampleState: 'Auckland',
      sampleZip: '1010',
    },
  },
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    currency: 'ZAR',
    currencySymbol: 'R ',
    currencyName: 'South African Rand',
    exchangeRate: 18.2,
    phoneCode: '+27',
    addressFormat: {
      stateLabel: 'Province',
      zipLabel: 'Postal Code',
      zipPlaceholder: 'e.g. 2001, 8001',
      sampleCity: 'Johannesburg',
      sampleState: 'Gauteng',
      sampleZip: '2001',
    },
  },
  {
    code: 'SE',
    name: 'Sweden',
    flag: '🇸🇪',
    currency: 'SEK',
    currencySymbol: 'kr ',
    currencyName: 'Swedish Krona',
    exchangeRate: 10.8,
    phoneCode: '+46',
    addressFormat: {
      stateLabel: 'County (Län)',
      zipLabel: 'Postal Code',
      zipPlaceholder: 'e.g. 111 22',
      sampleCity: 'Stockholm',
      sampleState: 'Stockholm',
      sampleZip: '111 22',
    },
  },
];

// All interface strings are standardized in English
const ENGLISH_STRINGS: Record<string, string> = {
  shop: 'Shop',
  tracking: 'Tracking',
  trackOrder: 'Track Order',
  admin: 'Admin Console',
  wishlist: 'Wishlist',
  allProducts: 'All Products',
  categories: 'Categories',
  searchPlaceholder: 'Search products, categories, or gear...',
  quickJump: 'Quick Jump to Product',
  selectProduct: 'Select any product to view...',
  addToCart: 'Add to Cart',
  buyNow: 'Buy Now',
  checkout: 'Checkout',
  inStock: 'In Stock',
  outOfStock: 'Out of Stock',
  unitsLeft: 'units left',
  freeShipping: 'Free Shipping',
  subtotal: 'Subtotal',
  discount: 'Discount',
  tax: 'Estimated Tax',
  total: 'Total Due',
  placeOrder: 'Place Order',
  shippingAddress: 'Shipping Address',
  deliveryOptions: 'Delivery Options',
  paymentMethod: 'Payment Method',
  fullName: 'Full Name',
  emailAddress: 'Email Address',
  phoneNumber: 'Phone Number',
  flatHouse: 'Flat / House No. / Building',
  streetAddress: 'Street / Area / Sector',
  landmark: 'Landmark (Optional)',
  city: 'City / Town',
  reviews: 'Reviews',
  orders: 'Orders',
  countryAndCurrency: 'Country & Currency Settings',
  changeCountryDesc: 'Select your delivery country. Prices and shipping calculations will update instantly in that currency.',
  currencyAutoCalculated: 'Prices automatically converted in real time based on standard international exchange rates.',
  currentLocation: 'Selected Destination',
  applySettings: 'Save & Apply',
  cancel: 'Cancel',
};

interface LocaleContextType {
  country: CountryConfig;
  setCountry: (countryCode: string) => void;
  isLocaleModalOpen: boolean;
  setIsLocaleModalOpen: (open: boolean) => void;
  formatPrice: (usdPrice: number, options?: { showCurrencyCode?: boolean; roundWhole?: boolean }) => string;
  convertPrice: (usdPrice: number) => number;
  t: (key: string, fallback?: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to India INR or saved country
  const [country, setCountryState] = useState<CountryConfig>(() => {
    try {
      const savedCountryCode = localStorage.getItem('shopzone_country') || localStorage.getItem('shop_country');
      if (savedCountryCode) {
        const found = COUNTRIES.find(c => c.code === savedCountryCode);
        if (found) return found;
      }
    } catch {
      // fallback
    }
    return COUNTRIES[0]; // India (INR ₹) as requested
  });

  const [isLocaleModalOpen, setIsLocaleModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('shopzone_country', country.code);
    } catch (e) {
      console.error('Failed to save country to localStorage', e);
    }
  }, [country]);

  const setCountry = (countryCode: string) => {
    const found = COUNTRIES.find(c => c.code === countryCode);
    if (found) {
      setCountryState(found);
      try {
        localStorage.setItem('shopzone_country', found.code);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const convertPrice = (usdPrice: number): number => {
    return usdPrice * country.exchangeRate;
  };

  const formatPrice = (
    usdPrice: number,
    options?: { showCurrencyCode?: boolean; roundWhole?: boolean }
  ): string => {
    if (usdPrice === 0) return 'FREE';

    const localAmount = usdPrice * country.exchangeRate;
    const { currencySymbol, currency } = country;

    // For currencies like JPY, KRW, INR, format cleanly
    const needsWholeNumber =
      country.code === 'JP' ||
      country.code === 'KR' ||
      (country.code === 'IN' && options?.roundWhole !== false);

    let formattedNumber: string;
    if (needsWholeNumber) {
      formattedNumber = Math.round(localAmount).toLocaleString(
        country.code === 'IN' ? 'en-IN' : 'en-US'
      );
    } else {
      formattedNumber = localAmount.toLocaleString(
        country.code === 'IN' ? 'en-IN' : 'en-US',
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      );
    }

    const priceString = `${currencySymbol}${formattedNumber}`;
    return options?.showCurrencyCode ? `${priceString} ${currency}` : priceString;
  };

  const t = (key: string, fallback?: string): string => {
    return ENGLISH_STRINGS[key] || fallback || key;
  };

  return (
    <LocaleContext.Provider
      value={{
        country,
        setCountry,
        isLocaleModalOpen,
        setIsLocaleModalOpen,
        formatPrice,
        convertPrice,
        t,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
