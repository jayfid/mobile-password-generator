import KeyboardContext from "./keyboardContext";
import { getRandomIntWithLimit } from "./random";

class KeyboardLayout {
  constructor(id) {
    this.id = id;
    this.contexts = {};
    this.currentContext = null;
  }

  addContext(id, characters, next) {
    const context = new KeyboardContext(id, characters, next);
    this.contexts[id] = context;
    if (this.currentContext === null) {
      this.currentContext = id;
    }
  }

  getCharacterCount() {
    if (this.currentContext) {
      return this.contexts[this.currentContext].characters.length;
    }
    return 0;
  }

  getContextById(id) {
    if (!this.contexts[id]) {
      throw Error("Keyboard with supplied id does not exist");
    }
    return this.contexts[id];
  }

  getCharacterAtIndex(index) {
    if (index < this.getCharacterCount()) {
      return this.contexts[this.currentContext].characters[index];
    }
    throw Error("Index out of bounds");
  }

  getRandomCharacter() {
    return this.getCharacterAtIndex(
      getRandomIntWithLimit(this.getCharacterCount())
    );
  }

  nextContext() {
    const nextContextId =
      this.contexts[this.currentContext].getNextRandomContext();
    this.currentContext = nextContextId;
  }
}

export default KeyboardLayout;
