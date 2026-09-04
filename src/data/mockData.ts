import type { Patient, Prescription, Product, Sale, LabOrder, Expense, DeliveryOrder, PendingPayment, SelectedLens, Treatment } from '../types';

export const patients: Patient[] = [
  { id: 'P001', name: 'María García López', age: '39', dateOfBirth: '1985-03-15', address: 'Av. Reforma 123, CDMX', phone: '+52 55 1234 5678', email: 'maria.garcia@email.com', reasonForVisit: 'Dolor de cabeza frecuente', discomforts: 'Visión borrosa de lejos', hasIllness: 'No', otherInfo: '', usesGlasses: true, howFeelsWithGlasses: 'No se siente cómoda', occupation: 'Contadora', registrationDate: '2024-01-10', biography: 'Paciente con miopía leve desde la adolescencia. Usa lentes de forma intermitente. Trabaja 8h frente a computadora. Antecedentes familiares de miopía.' },
  { id: 'P002', name: 'Carlos Rodríguez Pérez', age: '36', dateOfBirth: '1990-07-22', address: 'Calle Insurgentes 456', phone: '+52 55 8765 4321', email: 'carlos.rodriguez@email.com', reasonForVisit: 'Revisión anual', discomforts: 'Cansancio visual en computadora', hasIllness: 'No', otherInfo: '', usesGlasses: true, howFeelsWithGlasses: 'Bien pero se le empañan', occupation: 'Ingeniero', registrationDate: '2024-01-15', biography: 'Ingeniero de software con alta exposición a pantallas. Hipermetropía diagnosticada en 2018. Requiere control anual.' },
  { id: 'P003', name: 'Ana Martínez Sánchez', age: '46', dateOfBirth: '1978-11-08', address: 'Blvd. Ángeles 789', phone: '+52 55 1122 3344', email: 'ana.martinez@email.com', reasonForVisit: 'Renovar receta', discomforts: 'No ve de cerca', hasIllness: 'Hipertensión', otherInfo: 'Tratamiento con Losartán', usesGlasses: true, howFeelsWithGlasses: 'Necesita nuevos', occupation: 'Doctora', registrationDate: '2024-02-01', biography: 'Médica con presbicia incipiente. Miopía moderada con astigmatismo. Control de hipertensión con medicamento.' },
  { id: 'P004', name: 'Roberto Hernández Díaz', age: '29', dateOfBirth: '1995-05-30', address: 'Calle Juárez 321', phone: '+52 55 4433 2211', email: 'roberto.hernandez@email.com', reasonForVisit: 'Primera vez', discomforts: 'Dolor de cabeza', hasIllness: 'No', otherInfo: '', usesGlasses: false, howFeelsWithGlasses: '', occupation: 'Diseñador', registrationDate: '2024-02-10', biography: 'Diseñador gráfico, primera consulta oftalmológica. Síntomas recientes de astenopia.' },
  { id: 'P005', name: 'Laura Jiménez Flores', age: '36', dateOfBirth: '1988-09-12', address: 'Av. Universidad 654', phone: '+52 55 5566 7788', email: 'laura.jimenez@email.com', reasonForVisit: 'Molestia en los ojos', discomforts: 'Ojos rojos y lagrimeo', hasIllness: 'Diabetes tipo 2', otherInfo: 'Control con Metformina', usesGlasses: true, howFeelsWithGlasses: 'Regular', occupation: 'Profesora', registrationDate: '2024-02-15', biography: 'Profesora con diabetes tipo 2 controlada. Requiere seguimiento oftalmológico anual por retinopatía.' },
  { id: 'P006', name: 'Fernando Torres Ruiz', age: '42', dateOfBirth: '1982-01-25', address: 'Calle Morelos 987', phone: '+52 55 9988 7766', email: 'fernando.torres@email.com', reasonForVisit: 'Examen completo', discomforts: 'Visión doble a veces', hasIllness: 'No', otherInfo: 'Cirugía de cataratas previa', usesGlasses: true, howFeelsWithGlasses: 'Necesita cambio', occupation: 'Abogado', registrationDate: '2024-03-01', biography: 'Abogado con miopía alta y cirugía de cataratas en 2020. Graduación con cambios anuales significativos.' },
  { id: 'P007', name: 'Patricia Vargas Mendoza', age: '49', dateOfBirth: '1975-12-03', address: 'Blvd. Díaz Ordaz 147', phone: '+52 55 3344 5566', email: 'patricia.vargas@email.com', reasonForVisit: 'Dificultad para leer', discomforts: 'No puede leer letras pequeñas', hasIllness: 'No', otherInfo: '', usesGlasses: false, howFeelsWithGlasses: '', occupation: 'Maestra', registrationDate: '2024-03-05', biography: 'Maestra con presbicia. Aún no usa corrección, evalúa primera graduación para cerca.' },
  { id: 'P008', name: 'Miguel Ángel Castro', age: '24', dateOfBirth: '2000-06-18', address: 'Av. Hidalgo 258', phone: '+52 55 7788 9900', email: 'miguel.castro@email.com', reasonForVisit: 'Revisión de contacto', discomforts: 'Sequedad con lente de contacto', hasIllness: 'No', otherInfo: 'Usa Biofinity Toric', usesGlasses: true, howFeelsWithGlasses: 'Usa más lentes de contacto', occupation: 'Estudiante', registrationDate: '2024-03-10', biography: 'Estudiante universitario, usuario de lentes de contacto tóricos. Presenta síndrome de ojo seco leve.' },
];

export const products: Product[] = [
  { id: 'PRD001', name: 'Montura Ray-Ban', model: 'Wayfarer RB2140', category: 'Monturas', price: 2800, cost: 1400, stock: 15, brand: 'Ray-Ban', material: 'Acetato', color: 'Negro', forma: 'Rectangular', talla: '54-18-140', proveedor: 'Proveedor A', sucursal: 'Dolores', exhibidor: 'Vitrina 1', estatus: 'Disponible' },
  { id: 'PRD002', name: 'Montura Oakley', model: 'Holbrook OO9102', category: 'Monturas', price: 3200, cost: 1600, stock: 8, brand: 'Oakley', material: 'Metal', color: 'Carey', forma: 'Cuadrada', talla: '52-18-138', proveedor: 'Proveedor B', sucursal: 'Dolores', exhibidor: 'Vitrina 2', estatus: 'Disponible' },
  { id: 'PRD003', name: 'Montura Prada', model: 'PR 17VV', category: 'Monturas', price: 4500, cost: 2250, stock: 5, brand: 'Prada', material: 'Acetato', color: 'Dorado', forma: 'Redonda', talla: '50-20-145', proveedor: 'Proveedor A', sucursal: 'Dolores', exhibidor: 'Vitrina 3', estatus: 'Disponible' },
  { id: 'PRD004', name: 'Montura Nike', model: 'N 7189', category: 'Monturas', price: 1800, cost: 900, stock: 20, brand: 'Nike', material: 'Flexible', color: 'Azul', forma: 'Deportiva', talla: '56-16-135', proveedor: 'Proveedor C', sucursal: 'Dolores', exhibidor: 'Vitrina 1', estatus: 'Disponible' },
  { id: 'PRD005', name: 'Lente Contacto Acuvue', model: 'Oasys 1-Day', category: 'Lentes de Contacto', price: 1200, cost: 600, stock: 50, brand: 'Johnson & Johnson', material: 'Silicona Hidrogel', color: 'Transparente', proveedor: 'Proveedor A', sucursal: 'Dolores', exhibidor: 'Rack LC', estatus: 'Disponible' },
  { id: 'PRD006', name: 'Lente Contacto Biofinity', model: 'Torric', category: 'Lentes de Contacto', price: 1800, cost: 900, stock: 30, brand: 'CooperVision', material: 'Silicona Hidrogel', color: 'Transparente', proveedor: 'Proveedor B', sucursal: 'Dolores', exhibidor: 'Rack LC', estatus: 'Disponible' },
  { id: 'PRD007', name: 'Lente Contacto Air Optix', model: 'Colors', category: 'Lentes de Contacto', price: 900, cost: 450, stock: 40, brand: 'Alcon', material: 'Silicona', color: 'Varios', proveedor: 'Proveedor C', sucursal: 'Dolores', exhibidor: 'Rack LC', estatus: 'Disponible' },
  { id: 'PRD008', name: 'Cristal Antirreflejante', model: '1.67 Alto Índice', category: 'Cristales', price: 1500, cost: 750, stock: 25, brand: 'Essilor', material: 'Policarbonato', color: 'Transparente', forma: 'Monofocal', proveedor: 'Proveedor A', sucursal: 'Dolores', exhibidor: 'Vitrina Cristales', estatus: 'Disponible' },
  { id: 'PRD009', name: 'Cristal Blue Light', model: 'Crizal Prevencia', category: 'Cristales', price: 2200, cost: 1100, stock: 18, brand: 'Essilor', material: 'Policarbonato', color: 'Transparente', forma: 'Monofocal', proveedor: 'Proveedor A', sucursal: 'Dolores', exhibidor: 'Vitrina Cristales', estatus: 'Disponible' },
  { id: 'PRD010', name: 'Cristal Progresivo', model: 'Varilux X', category: 'Cristales', price: 4800, cost: 2400, stock: 12, brand: 'Essilor', material: 'Policarbonato', color: 'Transparente', forma: 'Progresivo', proveedor: 'Proveedor A', sucursal: 'Dolores', exhibidor: 'Vitrina Cristales', estatus: 'Disponible' },
  { id: 'PRD011', name: 'Cristal Fotocromático', model: 'Transitions Gen 8', category: 'Cristales', price: 2500, cost: 1250, stock: 15, brand: 'Transitions', material: 'Policarbonato', color: 'Gris', forma: 'Fotocromático', proveedor: 'Proveedor B', sucursal: 'Dolores', exhibidor: 'Vitrina Cristales', estatus: 'Disponible' },
  { id: 'PRD012', name: 'Estuche Premium', model: 'Cuero Negro', category: 'Accesorios', price: 350, cost: 175, stock: 45, brand: 'Genérico', material: 'Cuero', color: 'Negro', proveedor: 'Proveedor C', sucursal: 'Dolores', exhibidor: 'Estante Accesorios', estatus: 'Disponible' },
  { id: 'PRD013', name: 'Limpia Cristales Kit', model: 'Spray + Paño', category: 'Accesorios', price: 120, cost: 60, stock: 60, brand: 'OptiClean', material: 'Plástico', color: 'Azul', proveedor: 'Proveedor C', sucursal: 'Dolores', exhibidor: 'Estante Accesorios', estatus: 'Disponible' },
  { id: 'PRD014', name: 'Cadena para Montura', model: 'Metálica Dorada', category: 'Accesorios', price: 180, cost: 90, stock: 35, brand: 'Genérico', material: 'Metal', color: 'Dorado', proveedor: 'Proveedor C', sucursal: 'Dolores', exhibidor: 'Estante Accesorios', estatus: 'Disponible' },
  { id: 'PRD015', name: 'Spray Lente Contacto', model: 'ReNu MultiPlus', category: 'Accesorios', price: 250, cost: 125, stock: 40, brand: 'Bausch + Lomb', material: 'Líquido', color: 'Transparente', proveedor: 'Proveedor B', sucursal: 'Dolores', exhibidor: 'Estante Accesorios', estatus: 'Disponible' },
];

export const availableLenses: SelectedLens[] = [
  { id: 'L001', name: 'Cristal Monofocal', brand: 'Essilor', type: 'Monofocal', price: 800, quantity: 2 },
  { id: 'L002', name: 'Cristal Bifocal', brand: 'Essilor', type: 'Bifocal', price: 1200, quantity: 2 },
  { id: 'L003', name: 'Cristal Progresivo', brand: 'Essilor Varilux', type: 'Progresivo', price: 3500, quantity: 2 },
  { id: 'L004', name: 'Cristal Antirreflejante', brand: 'Crizal', type: 'Tratamiento AR', price: 600, quantity: 2 },
  { id: 'L005', name: 'Cristal Blue Light', brand: 'Crizal Prevencia', type: 'Filtro Luz Azul', price: 800, quantity: 2 },
  { id: 'L006', name: 'Cristal Fotocromático', brand: 'Transitions Gen 8', type: 'Fotocromático', price: 1200, quantity: 2 },
  { id: 'L007', name: 'Cristal Alto Índice 1.67', brand: 'Essilor', type: 'Alto Índice', price: 1500, quantity: 2 },
  { id: 'L008', name: 'Cristal Policarbonato', brand: 'Essilor', type: 'Policarbonato', price: 900, quantity: 2 },
  { id: 'L009', name: 'Lente Contacto Diario', brand: 'Acuvue Oasys', type: 'Descartable', price: 600, quantity: 30 },
  { id: 'L010', name: 'Lente Contacto Tórico', brand: 'Biofinity Toric', type: 'Tórico', price: 900, quantity: 30 },
];

export const availableTreatments: Treatment[] = [
  { id: 'T001', name: 'Limpieza Profunda', description: 'Limpieza ultrasónica de montura y lentes', price: 150 },
  { id: 'T002', name: 'Ajuste de Montura', description: 'Ajuste de patillas y puente nasal', price: 100 },
  { id: 'T003', name: 'Reparación de Montura', description: 'Soldadura, reemplazo de tornillos y piezas', price: 350 },
  { id: 'T004', name: 'Cambio de Lentes', description: 'Reemplazo de cristales en montura existente', price: 500 },
  { id: 'T005', name: 'Tratamiento Antirreflejante', description: 'Aplicación de coating AR en lentes', price: 400 },
  { id: 'T006', name: 'Tratamiento Endurecedor', description: 'Capa dura para resistencia a rayones', price: 300 },
  { id: 'T007', name: 'Adaptación de Lente de Contacto', description: 'Sesión de adaptación y enseñanza de uso', price: 500 },
  { id: 'T008', name: 'Examen de Seguimiento', description: 'Revisión de graduación y ajustes', price: 250 },
];

export const prescriptions: Prescription[] = [
  // María García López — evolución anual
  {
    id: 'R001', patientId: 'P001', patientName: 'María García López', date: '2024-11-15', doctor: 'Dr. Elena Ruiz',
    status: 'Vigente',
    rightEye: { sph: '-2.50', cyl: '-0.75', axis: '180', prisma: '0.00', add: '+1.00', dp: '32', av: '20/20' },
    leftEye: { sph: '-2.25', cyl: '-0.50', axis: '175', prisma: '0.00', add: '+1.00', dp: '32', av: '20/20' },
    recommendations: 'Miopía leve bilateral con presbicia incipiente', observations: 'Control en 12 meses',
    selectedLenses: [{ ...availableLenses[0], quantity: 2 }, { ...availableLenses[3], quantity: 2 }],
    treatments: [{ ...availableTreatments[0] }],
    totalLenses: 2800, totalTreatments: 150, grandTotal: 2950,
  },
  {
    id: 'R001-2023', patientId: 'P001', patientName: 'María García López', date: '2023-11-10', doctor: 'Dr. Elena Ruiz',
    status: 'Vencida',
    rightEye: { sph: '-2.00', cyl: '-0.50', axis: '180', prisma: '0.00', add: '+0.75', dp: '32', av: '20/20' },
    leftEye: { sph: '-1.75', cyl: '-0.50', axis: '175', prisma: '0.00', add: '+0.75', dp: '32', av: '20/20' },
    recommendations: 'Miopía leve estable', observations: 'Control anual',
    selectedLenses: [], treatments: [], totalLenses: 0, totalTreatments: 0, grandTotal: 0,
  },
  {
    id: 'R001-2022', patientId: 'P001', patientName: 'María García López', date: '2022-10-05', doctor: 'Dr. Elena Ruiz',
    status: 'Vencida',
    rightEye: { sph: '-1.75', cyl: '-0.50', axis: '180', prisma: '0.00', add: '+0.50', dp: '32', av: '20/20' },
    leftEye: { sph: '-1.50', cyl: '-0.25', axis: '175', prisma: '0.00', add: '+0.50', dp: '32', av: '20/20' },
    recommendations: 'Miopía leve inicial', observations: 'Primera graduación',
    selectedLenses: [], treatments: [], totalLenses: 0, totalTreatments: 0, grandTotal: 0,
  },
  {
    id: 'R002', patientId: 'P002', patientName: 'Carlos Rodríguez Pérez', date: '2024-10-20', doctor: 'Dr. Elena Ruiz',
    status: 'Vigente',
    rightEye: { sph: '+1.75', cyl: '-1.25', axis: '90', prisma: '0.00', add: '+2.00', dp: '34', av: '20/25' },
    leftEye: { sph: '+2.00', cyl: '-1.00', axis: '85', prisma: '0.00', add: '+2.00', dp: '34', av: '20/25' },
    recommendations: 'Hipermetropía con astigmatismo bilateral', observations: 'Usar lentes bifocales',
    selectedLenses: [{ ...availableLenses[1], quantity: 2 }],
    treatments: [{ ...availableTreatments[4] }],
    totalLenses: 2400, totalTreatments: 400, grandTotal: 2800,
  },
  {
    id: 'R003', patientId: 'P003', patientName: 'Ana Martínez Sánchez', date: '2024-09-05', doctor: 'Dr. Elena Ruiz',
    status: 'Vencida',
    rightEye: { sph: '-4.00', cyl: '-1.50', axis: '170', prisma: '0.00', add: '+1.50', dp: '30', av: '20/30' },
    leftEye: { sph: '-3.75', cyl: '-1.25', axis: '165', prisma: '0.00', add: '+1.50', dp: '30', av: '20/30' },
    recommendations: 'Miopía moderada con astigmatismo', observations: 'Renovar receta, visión ha cambiado',
    selectedLenses: [], treatments: [], totalLenses: 0, totalTreatments: 0, grandTotal: 0,
  },
  {
    id: 'R004', patientId: 'P005', patientName: 'Laura Jiménez Flores', date: '2024-12-01', doctor: 'Dr. Elena Ruiz',
    status: 'Vigente',
    rightEye: { sph: '-0.75', cyl: '0.00', axis: '0', prisma: '0.00', add: '+0.50', dp: '31', av: '20/20' },
    leftEye: { sph: '-0.50', cyl: '-0.25', axis: '10', prisma: '0.00', add: '+0.50', dp: '31', av: '20/20' },
    recommendations: 'Miopía leve incipiente', observations: 'Vigilar carga visual digital',
    selectedLenses: [{ ...availableLenses[6], quantity: 2 }],
    treatments: [],
    totalLenses: 3000, totalTreatments: 0, grandTotal: 3000,
  },
  {
    id: 'R005', patientId: 'P006', patientName: 'Fernando Torres Ruiz', date: '2025-01-10', doctor: 'Dr. Elena Ruiz',
    status: 'Pendiente',
    rightEye: { sph: '-6.00', cyl: '-2.00', axis: '160', prisma: '0.50', add: '+2.50', dp: '33', av: '20/40' },
    leftEye: { sph: '-5.50', cyl: '-1.75', axis: '155', prisma: '0.50', add: '+2.50', dp: '33', av: '20/40' },
    recommendations: 'Miopía alta con astigmatismo significativo', observations: 'Evaluación adicional requerida',
    selectedLenses: [{ ...availableLenses[2], quantity: 2 }, { ...availableLenses[5], quantity: 2 }],
    treatments: [{ ...availableTreatments[3] }, { ...availableTreatments[4] }],
    totalLenses: 9400, totalTreatments: 900, grandTotal: 10300,
  },
  {
    id: 'R005-2024', patientId: 'P006', patientName: 'Fernando Torres Ruiz', date: '2024-01-12', doctor: 'Dr. Elena Ruiz',
    status: 'Vencida',
    rightEye: { sph: '-5.25', cyl: '-1.75', axis: '160', prisma: '0.50', add: '+2.00', dp: '33', av: '20/30' },
    leftEye: { sph: '-4.75', cyl: '-1.50', axis: '155', prisma: '0.25', add: '+2.00', dp: '33', av: '20/30' },
    recommendations: 'Miopía alta progresiva', observations: 'Aumento anual -0.75',
    selectedLenses: [], treatments: [], totalLenses: 0, totalTreatments: 0, grandTotal: 0,
  },
  {
    id: 'R005-2023', patientId: 'P006', patientName: 'Fernando Torres Ruiz', date: '2023-01-10', doctor: 'Dr. Elena Ruiz',
    status: 'Vencida',
    rightEye: { sph: '-4.50', cyl: '-1.50', axis: '160', prisma: '0.25', add: '+1.75', dp: '33', av: '20/25' },
    leftEye: { sph: '-4.00', cyl: '-1.25', axis: '155', prisma: '0.25', add: '+1.75', dp: '33', av: '20/25' },
    recommendations: 'Miopía alta', observations: 'Control post-cirugía',
    selectedLenses: [], treatments: [], totalLenses: 0, totalTreatments: 0, grandTotal: 0,
  },
];

export const sales: Sale[] = [
  { id: 'V001', patientId: 'P001', patientName: 'María García López', items: [{ product: products[0], quantity: 1 }, { product: products[7], quantity: 2 }], subtotal: 5800, tax: 928, discount: 0, total: 6728, status: 'Entregado', paymentMethod: 'Efectivo', paymentDate: '2024-12-01', deliveryDate: '2024-12-10', createdAt: '2024-12-01' },
  { id: 'V002', patientId: 'P002', patientName: 'Carlos Rodríguez Pérez', items: [{ product: products[2], quantity: 1 }, { product: products[9], quantity: 2 }], subtotal: 14100, tax: 2256, discount: 500, total: 15856, status: 'Pagado', paymentMethod: 'Tarjeta Crédito', paymentDate: '2024-12-05', createdAt: '2024-12-05' },
  { id: 'V003', patientId: 'P003', patientName: 'Ana Martínez Sánchez', items: [{ product: products[3], quantity: 1 }, { product: products[10], quantity: 1 }], subtotal: 4300, tax: 688, discount: 0, total: 4988, status: 'Pendiente', createdAt: '2024-12-10' },
  { id: 'V004', patientId: 'P005', patientName: 'Laura Jiménez Flores', items: [{ product: products[1], quantity: 1 }, { product: products[8], quantity: 2 }], subtotal: 7600, tax: 1216, discount: 300, total: 8516, status: 'Parcial', paymentMethod: 'Anticipo', paymentDate: '2024-12-12', createdAt: '2024-12-12' },
  { id: 'V005', patientId: 'P006', patientName: 'Fernando Torres Ruiz', items: [{ product: products[4], quantity: 2 }, { product: products[12], quantity: 1 }], subtotal: 2520, tax: 403.20, discount: 0, total: 2923.20, status: 'Pagado', paymentMethod: 'Transferencia', paymentDate: '2024-12-15', createdAt: '2024-12-15' },
  { id: 'V006', patientId: 'P007', patientName: 'Patricia Vargas Mendoza', items: [{ product: products[0], quantity: 1 }], subtotal: 2800, tax: 448, discount: 200, total: 3048, status: 'Pendiente', createdAt: '2024-12-18' },
  { id: 'V007', patientId: 'P008', patientName: 'Miguel Ángel Castro', items: [{ product: products[5], quantity: 2 }, { product: products[11], quantity: 1 }], subtotal: 3950, tax: 632, discount: 0, total: 4582, status: 'Pendiente', createdAt: '2024-12-20' },
];

export const labOrders: LabOrder[] = [
  { id: 'LO001', saleId: 'V002', patientName: 'Carlos Rodríguez Pérez', products: 'Montura Prada + Cristal Progresivo', status: 'Montando', operator: 'Juan Taller', startDate: '2024-12-06', estimatedDelivery: '2024-12-16', prescriptionId: 'R002', phase: 4, examName: 'Examen Visual Completo', baseType: 'Progresivo' },
  { id: 'LO002', saleId: 'V004', patientName: 'Laura Jiménez Flores', products: 'Montura Oakley + Cristal Blue Light', status: 'Puliendo', operator: 'Juan Taller', startDate: '2024-12-13', estimatedDelivery: '2024-12-23', prescriptionId: 'R004', phase: 3, examName: 'Examen Visual Completo', baseType: 'Blue Light' },
  { id: 'LO003', saleId: 'V001', patientName: 'María García López', products: 'Montura Ray-Ban + Cristal AR', status: 'Listo', operator: 'Juan Taller', startDate: '2024-12-02', estimatedDelivery: '2024-12-10', prescriptionId: 'R001', phase: 6, examName: 'Examen Visual Completo', baseType: 'Antirreflejante' },
];

export const expenses: Expense[] = [
  { id: 'G001', concept: 'Renta local comercial', category: 'Renta', amount: 15000, date: '2024-12-01' },
  { id: 'G002', concept: 'Servicio de luz eléctrica', category: 'Servicios', amount: 2800, date: '2024-12-05' },
  { id: 'G003', concept: 'Reposición de stock Ray-Ban', category: 'Compras', amount: 35000, date: '2024-12-08' },
  { id: 'G004', concept: 'Nómina quincenal', category: 'Nómina', amount: 42000, date: '2024-12-15' },
  { id: 'G005', concept: 'Servicio de internet fibra', category: 'Servicios', amount: 800, date: '2024-12-10' },
  { id: 'G006', concept: 'Materiales de laboratorio', category: 'Insumos', amount: 5500, date: '2024-12-12' },
  { id: 'G007', concept: 'Mantenimiento equipo oftalmológico', category: 'Servicios', amount: 3500, date: '2024-12-18' },
];

export const deliveryOrders: DeliveryOrder[] = [
  { id: 'E001', saleId: 'V003', patientName: 'Ana Martínez Sánchez', patientPhone: '+52 55 1122 3344', products: 'Montura Nike + Cristal Fotocromático', prescription: 'Sph: -4.00/-3.75', status: 'Preparando', createdAt: '2024-12-11' },
  { id: 'E002', saleId: 'V006', patientName: 'Patricia Vargas Mendoza', patientPhone: '+52 55 3344 5566', products: 'Montura Ray-Ban', prescription: 'N/A', status: 'Listo para entregar', createdAt: '2024-12-19' },
  { id: 'E003', saleId: 'V007', patientName: 'Miguel Ángel Castro', patientPhone: '+52 55 7788 9900', products: 'Lente Contacto Biofinity x2 + Estuche', prescription: 'N/A', status: 'Preparando', createdAt: '2024-12-21' },
];

export const pendingPayments: PendingPayment[] = [
  { id: 'CP001', saleId: 'V003', patientName: 'Ana Martínez Sánchez', total: 4988, paid: 0, pending: 4988, items: [{ product: products[3], quantity: 1 }, { product: products[10], quantity: 1 }], status: 'Pendiente', createdAt: '2024-12-10' },
  { id: 'CP002', saleId: 'V006', patientName: 'Patricia Vargas Mendoza', total: 3048, paid: 0, pending: 3048, items: [{ product: products[0], quantity: 1 }], status: 'Pendiente', createdAt: '2024-12-18' },
  { id: 'CP003', saleId: 'V007', patientName: 'Miguel Ángel Castro', total: 4582, paid: 0, pending: 4582, items: [{ product: products[5], quantity: 2 }, { product: products[11], quantity: 1 }], status: 'Pendiente', createdAt: '2024-12-20' },
  { id: 'CP004', saleId: 'V004', patientName: 'Laura Jiménez Flores', total: 8516, paid: 4000, pending: 4516, items: [{ product: products[1], quantity: 1 }, { product: products[8], quantity: 2 }], status: 'Parcial', createdAt: '2024-12-12' },
];
