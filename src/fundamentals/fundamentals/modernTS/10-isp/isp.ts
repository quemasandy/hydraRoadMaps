/**
 * MODERN TS: Interface Segregation Principle (ISP)
 *
 * En OOP: Interfaces pequeñas en lugar de una gigante.
 * En Modern TS: Utility Types (`Pick`, `Omit`) y tipos anónimos.
 *
 * No obligamos a los clientes a depender de cosas que no usan.
 */

type FullUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  address: string;
};

// El componente de UI solo necesita nombre e imagen
// Usamos `Pick` para crear un sub-tipo al vuelo
const UserCard = (user: Pick<FullUser, 'name' | 'email'>) => {
  console.log(`Card: ${user.name} (${user.email})`);
};

const myUser: FullUser = {
  id: '1',
  name: 'Andy',
  email: 'andy@test.com',
  passwordHash: '***',
  address: '123 St',
};

UserCard(myUser); // Funciona perfecto, TS sabe que cumple el sub-contrato
