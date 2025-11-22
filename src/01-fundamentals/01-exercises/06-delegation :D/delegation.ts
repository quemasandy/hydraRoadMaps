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
    console.log('ReadyState: Iniciando la reproducción');
    this.player.setState(new PlayingState(this.player));
  }

  pause() {
    console.log('ReadyState: No hay nada reproduciéndose');
  }

  stop() {
    console.log('ReadyState: Ya estamos detenidos');
  }
}

class PlayingState implements PlayerState {
  constructor(private player: AudioPlayer) {}

  play() {
    console.log('ReadyState: La pista ya está sonando');
  }

  pause() {
    console.log('ReadyState: Pausando la reproducción');
    this.player.setState(new ReadyState(this.player));
  }

  stop() {
    console.log('ReadyState: Deteniendo la reproducción');
    this.player.setState(new ReadyState(this.player));
  }
}

const player = new AudioPlayer();
player.setState(new ReadyState(player));
player.play();
player.pause();

export {};
