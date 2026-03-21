import KeyboardContext from "./keyboardContext";
import { getRandomIntWithLimit } from "./random";

class KeyboardLayout {
  id: string;

  contexts: Record<string, KeyboardContext>;

  currentContext: string | null;

  constructor(id: string) {
    this.id = id;
    this.contexts = {};
    this.currentContext = null;
  }

  addContext(id: string, characters: string[], next: string[]): void {
    const context = new KeyboardContext(id, characters, next);
    this.contexts[id] = context;
    if (this.currentContext === null) {
      this.currentContext = id;
    }
  }

  getCurrentContext(): KeyboardContext {
    if (this.currentContext === null) {
      throw Error("Current context does not exist");
    }
    return this.getContextById(this.currentContext);
  }

  getCharacterCount(): number {
    return this.getCurrentContext().characters.length;
  }

  getContextById(id: string): KeyboardContext {
    const context = this.contexts[id];
    if (!context) {
      throw Error("Keyboard with supplied id does not exist");
    }
    return context;
  }

  getCharacterAtIndex(index: number): string {
    const currentContext = this.getCurrentContext();
    if (index < currentContext.characters.length) {
      const character = currentContext.characters[index];
      if (character !== undefined) {
        return character;
      }
    }
    throw Error("Index out of bounds");
  }

  getRandomCharacter(): string {
    return this.getCharacterAtIndex(
      getRandomIntWithLimit(this.getCharacterCount()),
    );
  }

  nextContext(): void {
    const nextContextId = this.getCurrentContext().getNextRandomContext();
    this.currentContext = nextContextId;
  }
}

export default KeyboardLayout;
