import { getRandomIntWithLimit } from "./random";

class KeyboardLayout {
  constructor(id, label) {
    this.id = id;
    this.label = label;
    this.contexts = {};
    this.currentContext = null;
  }

  // add/update context in lists of contexts
  addContext(id, characters, next) {
    const context = { characters, next };
    this.contexts[id] = context;
    if (this.currentContext === null) {
      this.currentContext = id;
    }
  }

  // return count of characters in current context
  getCharacterCount() {
    if (this.currentContext) {
      return this.contexts[this.currentContext].characters.length
    }
    return false;
  }

  // return context with given id
  getContextById(id) {
    if (!this.contexts[id]) {
      throw Error("Keyboard with supplied id does not exist");
    }
    return this.contexts[id];
  }

  // return value from character array at index
  getCharacterAtIndex(index) {
    if (index < this.getCharacterCount()) {
      return this.contexts[this.currentContext].characters[index];
    }
    throw Error("Index out of bounds");
  }

  // return next "random" character
  getNextCharacter() {
    return this.getCharacterAtIndex(
      getRandomIntWithLimit(this.getCharacterCount())
    );
  }

  // choose next context and replace current context with it
  nextContext() {
    if (!this.contexts[this.currentContext].next || !this.contexts[this.currentContext].next.length) {
      throw Error("no available context");
    }
    const nextIndex = getRandomIntWithLimit(this.contexts[this.currentContext].next.length);
    const nextContextId = this.contexts[this.currentContext].next[nextIndex];
    this.currentContext = nextContextId;
  }
}

export default KeyboardLayout;
