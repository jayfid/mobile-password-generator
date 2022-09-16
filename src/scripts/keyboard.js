import { getRandomIntWithLimit } from "./random";

class KeyboardLayout {
  constructor(id, label) {
    this.id = id;
    this.label = label;
    this.contexts = [];
    this.currentContext = null;
  }

  // add/update context in lists of contexts
  addContext(id, characters, next) {
    const context = { id, characters, next };

    // if this context id is taken, update the existing entry
    for (let i = 0; i < this.contexts.length; i += 1) {
      if (this.contexts[i].id === id) {
        this.contexts[i] = context;
        return;
      }
    }
    this.contexts.push(context);
    if (this.currentContext === null) {
      this.currentContext = context;
    }
  }

  // return count of characters in current context
  getCharacterCount() {
    if (this.currentContext) {
      return this.currentContext.characters.length;
    }
    return false;
  }

  // return context with given id
  getContextById(id) {
    for (let i = 0; i < this.contexts.length; i += 1) {
      if (id === this.contexts[i].id) {
        return this.contexts[i];
      }
    }
    throw Error("Keyboard with supplied id does not exist");
  }

  // return value from character array at index
  getCharacterAtIndex(index) {
    if (index < this.getCharacterCount()) {
      return this.currentContext.characters[index];
    }
    throw Error("Index out of bounds");
  }

  // return next "random" character
  getNextCharacter() {
    return this.getCharacterAtIndex(
      getRandomIntWithLimit(this.currentContext.characters.length)
    );
  }

  // choose next context and replace current context with it
  nextContext() {
    if (!this.currentContext.next || !this.currentContext.next.length) {
      throw Error("no available context");
    }
    const nextIndex = getRandomIntWithLimit(this.currentContext.next.length);
    const nextContextId = this.currentContext.next[nextIndex];
    this.currentContext = this.getContextById(nextContextId);
  }

  // sets current context to first context in list
  resetContext() {
    if (this.contexts && this.contexts.length) {
      [this.currentContext] = this.contexts;
    }
  }
}

export default KeyboardLayout;
