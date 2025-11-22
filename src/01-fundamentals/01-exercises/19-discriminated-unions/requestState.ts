// Definimos los estados posibles como interfaces simples
interface IdleState {
  status: 'idle';
}

interface LoadingState {
  status: 'loading';
}

interface SuccessState {
  status: 'success';
  data: string[]; // Solo existe si status es 'success'
}

interface ErrorState {
  status: 'error';
  error: string; // Solo existe si status es 'error'
}

// La Unión Discriminada
type RequestState = IdleState | LoadingState | SuccessState | ErrorState;

// Función que maneja el estado (Reducer / Handler)
function renderUI(state: RequestState) {
  switch (state.status) {
    case 'idle':
      console.log('Esperando acción del usuario...');
      break;
    case 'loading':
      console.log('Cargando datos... ⏳');
      // console.log(state.data); // Error! TypeScript sabe que 'data' no existe aquí.
      break;
    case 'success':
      console.log(`Datos recibidos: ${state.data.join(', ')}`);
      break;
    case 'error':
      console.log(`Error: ${state.error} ❌`);
      break;
  }
}

// Simulación de uso
let currentState: RequestState = { status: 'idle' };
renderUI(currentState);

currentState = { status: 'loading' };
renderUI(currentState);

currentState = { status: 'success', data: ['Usuario 1', 'Usuario 2'] };
renderUI(currentState);

currentState = { status: 'error', error: 'Fallo de red' };
renderUI(currentState);

export {};
