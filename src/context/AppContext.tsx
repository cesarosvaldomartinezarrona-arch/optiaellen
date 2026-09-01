import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Patient, Prescription, Product, Sale, LabOrder, Expense, DeliveryOrder, PendingPayment, CartItem } from '../types';
import { patients as initialPatients, prescriptions as initialPrescriptions, products as initialProducts, sales as initialSales, labOrders as initialLabOrders, expenses as initialExpenses, deliveryOrders as initialDeliveryOrders, pendingPayments as initialPendingPayments } from '../data/mockData';

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
  const [rfc, setRfc] = useState('');
  const [regimenFiscal, setRegimenFiscal] = useState('');
  const [direccionSucursal, setDireccionSucursal] = useState('');
  const [cedula, setCedula] = useState('');
  const [licenciatura, setLicenciatura] = useState('');
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

  return (
    <AppContext.Provider value={{
      opticsName, setOpticsName,
      rfc, setRfc,
      regimenFiscal, setRegimenFiscal,
      direccionSucursal, setDireccionSucursal,
      cedula, setCedula,
      licenciatura, setLicenciatura,
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
