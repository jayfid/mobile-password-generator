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
    const nextIndex = getRandomIntWithLimit(this.adjacentContexts.length);
    return this.adjacentContexts[nextIndex];
  }
}

export default KeyboardContext;
