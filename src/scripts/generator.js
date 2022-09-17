import iPhoneKeyboard from "./layouts/iphone";
import { getUniqueRandomIntsWithLimit } from "./random";

class PasswordGenerator {
  constructor() {
    this.keyboards = [];
    this.currentKeyboard = null;
    this.addKeyboard(iPhoneKeyboard);
  }

  // return keyboard object from id if exists
  getKeyboardById(id) {
    for (let i = 0, len = this.keyboards.length; i < len; i += 1) {
      if (id === this.keyboards[i].id) {
        return this.keyboards[i];
      }
    }
    throw Error("Keyboard with supplied id does not exist");
  }

  // append or replace keyboard to list of keyboards
  addKeyboard(keyboard) {
    // if keyboard with matching id already exists, replace it
    for (let i = 0, len = this.keyboards.length; i < len; i += 1) {
      if (keyboard.id === this.keyboards[i].id) {
        this.keyboards[i] = keyboard;
        return;
      }
    }

    this.keyboards.push(keyboard);
  }

  // setter method
  setCurrentKeyboard(keyboardId) {
    this.currentKeyboard = this.getKeyboardById(keyboardId);
  }

  // create and show a password
  generatePassword(charLen, keyboardId) {
    // number of times to switch contexts during password generation.
    // May make sense to expose this under a "Password Strength toggle"
    const numContextSwitches = 2;

    // make selected keyboard readily available
    this.setCurrentKeyboard(keyboardId);

    // generate list of indices where we will switch keyboard context
    // starting from the second index,
    const contextSwitchIndices = getUniqueRandomIntsWithLimit(
      charLen,
      numContextSwitches,
      1
    );

    let password = "";
    let currentIndex = 0;
    while (password.length < charLen) {
      // if current index matches a value in the context switch index array,
      // move forward in the array.
      for (let i = 0; i < numContextSwitches; i += 1) {
        if (contextSwitchIndices[i] === currentIndex) {
          this.currentKeyboard.nextContext();
        }
      }
      password += this.currentKeyboard.getNextCharacter();
      currentIndex += 1;
    }
    return password;
  }
}

export default PasswordGenerator;
