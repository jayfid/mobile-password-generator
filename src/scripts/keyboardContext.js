import { getRandomIntWithLimit } from "./random";

class KeyboardContext {
  constructor(id, characters, adjacentContexts) {
    this.id = id;
    this.characters = characters;
    this.adjacentContexts = adjacentContexts;
  }

  getNextRandomContext() {
    if (!this.adjacentContexts || !this.adjacentContexts.length) {
      throw Error("no available context");
    }
    // Have a 70% chance of switching to the 0-index of the adjacent
    // contexts to prevent commonly switching back to contexts
    // that have already been used.
    const diceRoll =  getRandomIntWithLimit(10) <= 7;
    const nextIndex = (diceRoll) ? 0 : getRandomIntWithLimit(this.adjacentContexts.length);
    return this.adjacentContexts[nextIndex];
  }
}

export default KeyboardContext;
