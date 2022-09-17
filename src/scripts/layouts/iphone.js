import KeyboardLayout from "../keyboard";

const iPhoneKeyboard = new KeyboardLayout("iphone", "iPhone");
iPhoneKeyboard.addContext(
  "alpha_lowercase",
  [
    "q",
    "w",
    "e",
    "r",
    "t",
    "y",
    "u",
    "i",
    "o",
    "p",
    "a",
    "s",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "z",
    "x",
    "c",
    "v",
    "b",
    "n",
    "m",
  ],
  ["alpha_uppercase", "symbol_1"]
);
iPhoneKeyboard.addContext(
  "alpha_uppercase",
  [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
  ],
  ["symbol_1", "alpha_lowercase"]
);
iPhoneKeyboard.addContext(
  "symbol_1",
  [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "-",
    "/",
    ":",
    ";",
    "(",
    ")",
    "$",
    "&",
    "@",
    '"',
    ".",
    ",",
    "?",
    "!",
    "'",
  ],
  ["alpha_lowercase", "symbol_2"]
);
iPhoneKeyboard.addContext(
  "symbol_2",
  [
    "[",
    "]",
    "{",
    "}",
    "#",
    "%",
    "^",
    "*",
    "+",
    "=",
    "_",
    "\\",
    "|",
    "~",
    "<",
    ">",
    "€",
    "£",
    "¥",
    "•",
    ".",
    ",",
    "?",
    "!",
    "`",
  ],
  ["alpha_lowercase", "symbol_1"]
);

export default iPhoneKeyboard;
