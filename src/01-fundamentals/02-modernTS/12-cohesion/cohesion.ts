/**
 * MODERN TS: Cohesion
 *
 * En OOP: Clases que agrupan métodos relacionados.
 * En Modern TS: Módulos (archivos) que agrupan tipos y funciones relacionadas.
 *
 * "Las cosas que cambian juntas, deben estar juntas".
 */

// MODULE: Cart (Todo lo relacionado con el carrito en un solo lugar)

export type CartItem = { id: string; price: number; qty: number };
export type Cart = { items: CartItem[] };

// Funciones puras relacionadas con el tipo `Cart`
export const emptyCart = (): Cart => ({ items: [] });

export const addItem = (cart: Cart, item: CartItem): Cart => ({
  items: [...cart.items, item],
});

export const cartTotal = (cart: Cart): number =>
  cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

// Al exportar todo junto, el módulo tiene alta cohesión.
