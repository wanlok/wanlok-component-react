export {};

declare global {
  interface RufflePlayer {
    createPlayer(): RufflePlayerElement;
  }

  interface RufflePlayerElement extends HTMLElement {
    load(url: string): void;
  }

  interface Window {
    RufflePlayer?: {
      newest(): RufflePlayer;
    };
  }
}
