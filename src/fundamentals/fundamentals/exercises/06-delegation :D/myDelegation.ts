interface PlayerState {
  getStateName(): string;
  play(): void;
  pause(): void;
  stop(): void;
}

class ReadyState implements PlayerState {
  getStateName(): string {
    return 'ReadyState';
  }
  play(): void {
    console.log('ReadyState - play pushed it - Playing the media.');
  }
  pause(): void {
    console.log('ReadyState - pause pushed it - Show song list.');
  }
  stop(): void {
    console.log('ReadyState - stop pushed it - Show song title.');
  }
}

class PlayingState implements PlayerState {
  getStateName(): string {
    return 'PlayingState';
  }
  play(): void {
    console.log('PlayingState - play pushed it - Give song description');
  }
  pause(): void {
    console.log('PlayingState - pause pushed it - pause the song.');
  }
  stop(): void {
    console.log('PlayingState - stop pushed it - Stop the song.');
  }
}

class PauseState implements PlayerState {
  getStateName(): string {
    return 'PauseState';
  }
  play(): void {
    console.log('PauseState - play pushed it - Resume the song.');
  }
  pause(): void {
    console.log('PauseState - pause pushed it - Show song list.');
  }
  stop(): void {
    console.log('PauseState - stop pushed it - Show song title.');
  }
}

class AudioPlayer {
  constructor(private state: PlayerState) {}

  setState(state: PlayerState) {
    this.state = state;
    console.log(`State changed to ${state.getStateName()}`);
  }

  play() {
    this.state.play();
    if (!(this.state instanceof PlayingState)) {
      this.setState(new PlayingState());
    }
  }

  pause() {
    this.state.pause();
    this.setState(new PauseState());
  }

  stop() {
    this.state.stop();
    this.setState(new ReadyState());
  }
}

const player = new AudioPlayer(new ReadyState());
player.play();
player.play();
player.play();
player.stop();
player.pause();


export {};
