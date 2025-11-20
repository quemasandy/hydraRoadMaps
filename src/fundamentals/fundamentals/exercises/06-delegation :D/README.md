# Delegación · Ejercicio

**Objetivo:** hacer que un objeto entregue el trabajo a otro especializado en lugar de resolverlo internamente.

## Escenario
Un reproductor de audio (`AudioPlayer`) cambia su comportamiento según el estado (ready, playing, paused). El contexto debe delegar cada acción al estado actual.

## Instrucciones
1. Declara una interfaz `PlayerState` con métodos `play()`, `pause()` y `stop()`.
2. Implementa al menos dos estados (`ReadyState`, `PlayingState`).
3. Crea una clase `AudioPlayer` que mantenga una referencia al estado y exponga los mismos métodos.
4. Dentro de cada método de `AudioPlayer`, delega la llamada al estado y permite que este cambie el estado del contexto.
5. Demuestra cómo el jugador cambia de estado sin condicionales en `AudioPlayer`.

```typescript
interface PlayerState {
  play(): void;
  pause(): void;
  stop(): void;
}

class AudioPlayer {
  private state!: PlayerState;

  setState(state: PlayerState) {
    this.state = state;
  }

  play() {
    this.state.play();
  }

  pause() {
    this.state.pause();
  }

  stop() {
    this.state.stop();
  }
}

class ReadyState implements PlayerState {
  constructor(private player: AudioPlayer) {}

  play() {
    console.log("Iniciando la reproducción");
    this.player.setState(new PlayingState(this.player));
  }

  pause() {
    console.log("No hay nada reproduciéndose");
  }

  stop() {
    console.log("Ya estamos detenidos");
  }
}

class PlayingState implements PlayerState {
  constructor(private player: AudioPlayer) {}

  play() {
    console.log("La pista ya está sonando");
  }

  pause() {
    console.log("Pausando la reproducción");
    this.player.setState(new ReadyState(this.player));
  }

  stop() {
    console.log("Deteniendo la reproducción");
    this.player.setState(new ReadyState(this.player));
  }
}

const player = new AudioPlayer();
player.setState(new ReadyState(player));
player.play();
player.pause();
```

## Resultado esperado
- `AudioPlayer` no contiene lógica condicional sobre estados, solo delega.
- Cada estado conoce las reglas particulares y puede transicionar al siguiente.
- Se hace evidente cómo delegación + composición soportan patrones como State.
