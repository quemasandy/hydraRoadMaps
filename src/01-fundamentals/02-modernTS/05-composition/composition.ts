/**
 * MODERN TS: Composition
 *
 * En OOP: Objetos conteniendo otros objetos.
 * En Modern TS: Composición de Funciones (Pipe / Flow).
 *
 * Pasamos datos a través de una tubería de funciones pequeñas.
 */

const trim = (s: string) => s.trim();
const toLower = (s: string) => s.toLowerCase();
const wrap = (tag: string) => (s: string) => `<${tag}>${s}</${tag}>`;

// Composición manual
const formatTitle = (input: string) => {
  const trimmed = trim(input);
  const lower = toLower(trimmed);
  return wrap('h1')(lower);
};

// Composición funcional (estilo pipe)
// const formatTitlePipe = pipe(trim, toLower, wrap('h1'));

console.log(formatTitle('  HELLO WORLD  ')); // <h1>hello world</h1>
