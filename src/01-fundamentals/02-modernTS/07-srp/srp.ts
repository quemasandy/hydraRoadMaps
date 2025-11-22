/**
 * MODERN TS: Single Responsibility Principle (SRP)
 *
 * En OOP: "Una clase debe tener una sola razón para cambiar".
 * En Modern TS: "Una función debe hacer una sola cosa y hacerla bien".
 *
 * Separamos I/O (Efectos) de la Lógica Pura.
 */

type Order = { id: string; items: string[]; total: number };

// 1. Cálculo puro (Fácil de testear, sin efectos secundarios)
export const calculateTotal = (items: { price: number }[]) =>
  items.reduce((sum, item) => sum + item.price, 0);

// 2. Formateo puro
export const formatInvoice = (order: Order) =>
  `Invoice #${order.id}: $${order.total}`;

// 3. Efecto secundario (I/O) - Separado
export const saveToDb = async (order: Order) => {
  console.log('Saving to DB...', order);
};

// Orquestador (Composition Root)
export const processOrder = async (items: { price: number }[]) => {
  const total = calculateTotal(items); // Logic
  const order = { id: '1', items: [], total };
  await saveToDb(order); // Effect
  return formatInvoice(order); // Logic
};
