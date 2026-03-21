import { getRandomIntWithLimit } from "./random";

class KeyboardContext {
  id: string;

  characters: string[];

  adjacentContexts: string[];

  constructor(id: string, characters: string[], adjacentContexts: string[]) {
    this.id = id;
    this.characters = characters;
    this.adjacentContexts = adjacentContexts;
  }

  getNextRandomContext(): string {
    if (!this.adjacentContexts.length) {
      throw Error("no available context");
    }
    // Have a 70% chance of switching to the 0-index of the adjacent
    // contexts to prevent commonly switching back to contexts
    // that have already been used.
    const diceRoll = getRandomIntWithLimit(10) <= 7;
    const nextIndex = diceRoll
      ? 0
      : getRandomIntWithLimit(this.adjacentContexts.length);
    const nextContext = this.adjacentContexts[nextIndex];
    if (!nextContext) {
      throw Error("next context does not exist");
    }
    return nextContext;
  }
}

export default KeyboardContext;
