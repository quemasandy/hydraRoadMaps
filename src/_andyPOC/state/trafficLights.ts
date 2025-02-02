// Interfaz para los estados del semáforo
interface TrafficLightState {
  handleNext(light: TrafficLight): void;
  getColor(): string;
}

// Clase Contexto que representa el semáforo
class TrafficLight {
  private currentState: TrafficLightState;

  constructor(initialState: TrafficLightState) {
    this.currentState = initialState;
  }

  // Cambia al siguiente estado
  setState(state: TrafficLightState): void {
    this.currentState = state;
  }

  // Delegar el manejo al estado actual
  next(): void {
    this.currentState.handleNext(this);
  }

  getColor(): string {
    return this.currentState.getColor();
  }
}

// Estados concretos
class RedState implements TrafficLightState {
  handleNext(light: TrafficLight): void {
    console.log("Cambiando de Rojo a Verde...");
    light.setState(new GreenState());
  }

  getColor(): string {
    return "Rojo";
  }
}

class GreenState implements TrafficLightState {
  handleNext(light: TrafficLight): void {
    console.log("Cambiando de Verde a Amarillo...");
    light.setState(new YellowState());
  }

  getColor(): string {
    return "Verde";
  }
}

class YellowState implements TrafficLightState {
  handleNext(light: TrafficLight): void {
    console.log("Cambiando de Amarillo a Rojo...");
    light.setState(new RedState());
  }

  getColor(): string {
    return "Amarillo";
  }
}

// Uso de la máquina de estados
const trafficLight = new TrafficLight(new RedState());

console.log(`Estado inicial: ${trafficLight.getColor()}`); // "Rojo"

trafficLight.next(); // Cambia a Verde
console.log(`Estado actual: ${trafficLight.getColor()}`); // "Verde"

trafficLight.next(); // Cambia a Amarillo
console.log(`Estado actual: ${trafficLight.getColor()}`); // "Amarillo"

trafficLight.next(); // Cambia a Rojo
console.log(`Estado actual: ${trafficLight.getColor()}`); // "Rojo"