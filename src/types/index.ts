export interface Patient {
  id: string;
  name: string;
  age: string;
  dateOfBirth: string;
  address: string;
  phone: string;
  email: string;
  reasonForVisit: string;
  discomforts: string;
  hasIllness: string;
  otherInfo: string;
  usesGlasses: boolean;
  howFeelsWithGlasses: string;
  occupation: string;
  registrationDate: string;
  biography?: string;
  diagnostico?: string;
  observaciones?: string;
  baseMica?: string;
  armazon?: string;
  refractionOD?: { esfera: string; cilindro: string; eje: string; prisma: string; adicion: string };
  refractionOI?: { esfera: string; cilindro: string; eje: string; prisma: string; adicion: string };
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  doctor: string;
  status: 'Vigente' | 'Vencida' | 'Pendiente';
  rightEye: EyeData;
  leftEye: EyeData;
  recommendations: string;
  observations: string;
  selectedLenses?: SelectedLens[];
  treatments?: Treatment[];
  totalLenses: number;
  totalTreatments: number;
  grandTotal: number;
}

export interface SelectedLens {
  id: string;
  name: string;
  brand: string;
  type: string;
  price: number;
  quantity: number;
}

export interface Treatment {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface EyeData {
  sph: string;
  cyl: string;
  axis: string;
  prisma: string;
  add: string;
  dp: string;
  av: string;
}

export interface Product {
  id: string;
  name: string;
  model: string;
  category: ProductCategory;
  price: number;
  cost?: number;
  stock: number;
  image?: string;
  description?: string;
  brand?: string;
  type?: string;
  color?: string;
  material?: string;
  forma?: string;
  talla?: string;
  ganancia?: number;
  proveedor?: string;
  sucursal?: string;
  exhibidor?: string;
  estatus?: string;
}

export type ProductCategory = 'Monturas' | 'Lentes de Contacto' | 'Cristales' | 'Accesorios';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  patientId: string;
  patientName: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'Pendiente' | 'Pagado' | 'Parcial' | 'Entregado';
  paymentMethod?: PaymentMethod;
  paymentDate?: string;
  deliveryDate?: string;
  createdAt: string;
}

export type PaymentMethod = 'Efectivo' | 'Tarjeta Débito' | 'Tarjeta Crédito' | 'Transferencia' | 'Anticipo';

export interface LabOrder {
  id: string;
  saleId: string;
  patientName: string;
  products: string;
  status: LabStatus;
  operator: string;
  startDate: string;
  estimatedDelivery: string;
  prescriptionId?: string;
  phase: number;
}

export type LabStatus = 'Recibido' | 'Cortando' | 'Puliendo' | 'Montando' | 'Control de Calidad' | 'Listo';

export interface Expense {
  id: string;
  concept: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
}

export type ExpenseCategory = 'Renta' | 'Servicios' | 'Compras' | 'Nómina' | 'Insumos';

export interface DeliveryOrder {
  id: string;
  saleId: string;
  patientName: string;
  patientPhone: string;
  products: string;
  prescription: string;
  status: 'Preparando' | 'Listo para entregar' | 'Entregado';
  createdAt: string;
}

export interface PendingPayment {
  id: string;
  saleId: string;
  patientName: string;
  total: number;
  paid: number;
  pending: number;
  items: CartItem[];
  status: 'Pendiente' | 'Parcial';
  createdAt: string;
}

export type UserRole = 'admin' | 'comprador' | 'optometrista' | 'gerente';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
}
