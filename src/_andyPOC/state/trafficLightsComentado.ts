// Declaramos la interfaz que define lo que debe poder hacer cada estado del semáforo
interface TrafficLightState {
  // Método que obliga a cada estado a indicar cómo avanzar al siguiente estado
  handleNext(light: TrafficLight): void;
  // Método que obliga a cada estado a exponer el color que representa
  getColor(): string;
}

// Declaramos la clase que representa el semáforo y actúa como contexto del patrón State
class TrafficLight {
  // Propiedad privada que guarda el estado actual del semáforo
  private currentState: TrafficLightState;

  // El constructor recibe el estado inicial y lo asigna a la propiedad interna
  constructor(initialState: TrafficLightState) {
    // Guardamos el estado inicial para empezar la máquina de estados con un valor válido
    this.currentState = initialState;
  }

  // Método que permite reemplazar el estado actual por otro estado concreto
  setState(state: TrafficLightState): void {
    // Actualizamos la referencia interna para que el semáforo adopte el nuevo estado
    this.currentState = state;
  }

  // Método que delega en el estado actual la lógica de pasar al siguiente estado
  next(): void {
    // Invocamos la transición definida por el estado actual, pasando el contexto
    this.currentState.handleNext(this);
  }

  // Método que expone el color del estado actual al exterior
  getColor(): string {
    // Delegamos en el estado actual la responsabilidad de informar su color
    return this.currentState.getColor();
  }
}

// Declaramos el estado concreto que representa el color rojo del semáforo
class RedState implements TrafficLightState {
  // Definimos la transición desde el rojo hacia el estado verde
  handleNext(light: TrafficLight): void {
    // Mostramos por consola el cambio de color para seguimiento
    console.log("Cambiando de Rojo a Verde...");
    // Ajustamos el contexto para que use una nueva instancia del estado verde
    light.setState(new GreenState());
  }

  // Devolvemos el texto que identifica al estado rojo
  getColor(): string {
    // Retornamos el nombre del color asociado a este estado
    return "Rojo";
  }
}

// Declaramos el estado concreto que representa el color verde del semáforo
class GreenState implements TrafficLightState {
  // Definimos la transición desde el verde hacia el estado amarillo
  handleNext(light: TrafficLight): void {
    // Mostramos por consola el cambio de color para seguimiento
    console.log("Cambiando de Verde a Amarillo...");
    // Ajustamos el contexto para que use una nueva instancia del estado amarillo
    light.setState(new YellowState());
  }

  // Devolvemos el texto que identifica al estado verde
  getColor(): string {
    // Retornamos el nombre del color asociado a este estado
    return "Verde";
  }
}

// Declaramos el estado concreto que representa el color amarillo del semáforo
class YellowState implements TrafficLightState {
  // Definimos la transición desde el amarillo hacia el estado rojo
  handleNext(light: TrafficLight): void {
    // Mostramos por consola el cambio de color para seguimiento
    console.log("Cambiando de Amarillo a Rojo...");
    // Ajustamos el contexto para que use una nueva instancia del estado rojo
    light.setState(new RedState());
  }

  // Devolvemos el texto que identifica al estado amarillo
  getColor(): string {
    // Retornamos el nombre del color asociado a este estado
    return "Amarillo";
  }
}

// Creamos una nueva instancia del semáforo iniciando con el estado rojo
const trafficLight = new TrafficLight(new RedState());

// Mostramos en consola el color con el que arranca el semáforo
console.log(`Estado inicial: ${trafficLight.getColor()}`); // "Rojo"

// Solicitamos la transición al siguiente estado, que debería ser verde
trafficLight.next(); // Cambia a Verde
// Imprimimos el color actual después de pasar por la transición
console.log(`Estado actual: ${trafficLight.getColor()}`); // "Verde"

// Solicitamos la siguiente transición, pasando de verde a amarillo
trafficLight.next(); // Cambia a Amarillo
// Imprimimos el color actual tras la nueva transición
console.log(`Estado actual: ${trafficLight.getColor()}`); // "Amarillo"

// Solicitamos otra transición, lo que devuelve el semáforo al estado rojo
trafficLight.next(); // Cambia a Rojo
// Imprimimos el color actual para confirmar que volvimos al inicio del ciclo
console.log(`Estado actual: ${trafficLight.getColor()}`); // "Rojo"
