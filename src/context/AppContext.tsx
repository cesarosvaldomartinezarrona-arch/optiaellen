import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Patient, Prescription, Product, Sale, LabOrder, Expense, DeliveryOrder, PendingPayment, CartItem } from '../types';
import { patients as initialPatients, prescriptions as initialPrescriptions, products as initialProducts, sales as initialSales, labOrders as initialLabOrders, expenses as initialExpenses, deliveryOrders as initialDeliveryOrders, pendingPayments as initialPendingPayments } from '../data/mockData';

export type ThemeColor = '#7c3aed' | '#2563eb' | '#059669' | '#dc2626' | '#d97706';

interface AppContextType {
  opticsName: string;
  setOpticsName: React.Dispatch<React.SetStateAction<string>>;
  rfc: string;
  setRfc: React.Dispatch<React.SetStateAction<string>>;
  regimenFiscal: string;
  setRegimenFiscal: React.Dispatch<React.SetStateAction<string>>;
  direccionSucursal: string;
  setDireccionSucursal: React.Dispatch<React.SetStateAction<string>>;
  cedula: string;
  setCedula: React.Dispatch<React.SetStateAction<string>>;
  licenciatura: string;
  setLicenciatura: React.Dispatch<React.SetStateAction<string>>;
  telefonoOptica: string;
  setTelefonoOptica: React.Dispatch<React.SetStateAction<string>>;
  direccionFiscal: string;
  setDireccionFiscal: React.Dispatch<React.SetStateAction<string>>;
  themeColor: ThemeColor;
  setThemeColor: React.Dispatch<React.SetStateAction<ThemeColor>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  autoUppercase: boolean;
  setAutoUppercase: React.Dispatch<React.SetStateAction<boolean>>;
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  prescriptions: Prescription[];
  setPrescriptions: React.Dispatch<React.SetStateAction<Prescription[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  labOrders: LabOrder[];
  setLabOrders: React.Dispatch<React.SetStateAction<LabOrder[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  deliveryOrders: DeliveryOrder[];
  setDeliveryOrders: React.Dispatch<React.SetStateAction<DeliveryOrder[]>>;
  pendingPayments: PendingPayment[];
  setPendingPayments: React.Dispatch<React.SetStateAction<PendingPayment[]>>;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [opticsName, setOpticsName] = useState('opticællen');
  const [rfc, setRfc] = useState('SDI121109B14');
  const [regimenFiscal, setRegimenFiscal] = useState('612 - Persona Física con Actividades Empresariales');
  const [direccionSucursal, setDireccionSucursal] = useState('Dolores Hidalgo, GTO.');
  const [cedula, setCedula] = useState('12345678');
  const [licenciatura, setLicenciatura] = useState('UNAM');
  const [telefonoOptica, setTelefonoOptica] = useState('+52 55 1234 5678');
  const [direccionFiscal, setDireccionFiscal] = useState('');
  const [themeColor, setThemeColor] = useState<ThemeColor>(() => (localStorage.getItem('themeColor') as ThemeColor) || '#7c3aed');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [autoUppercase, setAutoUppercase] = useState(() => localStorage.getItem('autoUppercase') === 'true');
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [labOrders, setLabOrders] = useState<LabOrder[]>(initialLabOrders);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>(initialDeliveryOrders);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>(initialPendingPayments);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);
  const cartTotal = () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  useEffect(() => {
    localStorage.setItem('themeColor', themeColor);
    const r = parseInt(themeColor.slice(1, 3), 16);
    const g = parseInt(themeColor.slice(3, 5), 16);
    const b = parseInt(themeColor.slice(5, 7), 16);
    const dr = Math.max(0, r - 25);
    const dg = Math.max(0, g - 25);
    const db = Math.max(0, b - 25);
    const darkHex = `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
    document.documentElement.style.setProperty('--accent', themeColor);
    document.documentElement.style.setProperty('--accent-rgb', `${r} ${g} ${b}`);
    document.documentElement.style.setProperty('--accent-light', `rgba(${r}, ${g}, ${b}, 0.1)`);
    document.documentElement.style.setProperty('--accent-hover', `rgba(${r}, ${g}, ${b}, 0.9)`);
    document.documentElement.style.setProperty('--accent-dark', darkHex);
  }, [themeColor]);

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('autoUppercase', String(autoUppercase));
    if (autoUppercase) {
      document.documentElement.classList.add('auto-uppercase');
    } else {
      document.documentElement.classList.remove('auto-uppercase');
    }
  }, [autoUppercase]);

  return (
    <AppContext.Provider value={{
      opticsName, setOpticsName,
      rfc, setRfc,
      regimenFiscal, setRegimenFiscal,
      direccionSucursal, setDireccionSucursal,
      cedula, setCedula,
      licenciatura, setLicenciatura,
      telefonoOptica, setTelefonoOptica,
      direccionFiscal, setDireccionFiscal,
      themeColor, setThemeColor,
      darkMode, setDarkMode,
      autoUppercase, setAutoUppercase,
      patients, setPatients,
      prescriptions, setPrescriptions,
      products, setProducts,
      sales, setSales,
      labOrders, setLabOrders,
      expenses, setExpenses,
      deliveryOrders, setDeliveryOrders,
      pendingPayments, setPendingPayments,
      cart, setCart,
      addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
