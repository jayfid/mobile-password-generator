import PasswordGenerator from "./generator";
import androidKeyboard from "./layouts/android";
import iPhoneKeyboard from "./layouts/iphone";
import {
  generateAndCopy,
  generateAndDisplayPassword,
  submitPasswordForm,
} from "./passwordForm";
import VinylSelect from "./select";

type StoredOption = {
  id: string;
  value: string;
};

const getRequiredElement = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw Error(`Required element not found: ${selector}`);
  }
  return element;
};

const parseStoredOptions = (storedValue: string): StoredOption[] => {
  const parsedValue: unknown = JSON.parse(storedValue);
  if (!Array.isArray(parsedValue)) {
    return [];
  }

  return parsedValue.filter((item): item is StoredOption => {
    if (typeof item !== "object" || item === null) {
      return false;
    }

    const storedOption = item as Partial<StoredOption>;
    return (
      typeof storedOption.id === "string" &&
      typeof storedOption.value === "string"
    );
  });
};

// Selects
for (const item of document.querySelectorAll(".select-style")) {
  new VinylSelect(item);
}

// Buttons
getRequiredElement<HTMLButtonElement>("#generate").addEventListener(
  "click",
  submitPasswordForm,
);
getRequiredElement<HTMLButtonElement>("#generate-copy").addEventListener(
  "click",
  generateAndCopy,
);

// Clipboard
getRequiredElement<HTMLElement>("#password-field").addEventListener(
  "click",
  () => {
    const textValue = getRequiredElement<HTMLInputElement>("#password").value;
    navigator.clipboard.writeText(textValue).then(() => {
      getRequiredElement<HTMLElement>(".copy-alert").classList.toggle("slide");
    });
  },
);

// Persist Selections
document.body.addEventListener("vinylSelectUpdate", () => {
  const options: StoredOption[] = [
    {
      id: "charlen",
      value: getRequiredElement<HTMLInputElement>("#charlen").value,
    },
    {
      id: "keyboard",
      value: getRequiredElement<HTMLInputElement>("#keyboard").value,
    },
  ];
  localStorage.setItem("mpg_options", JSON.stringify(options));
  generateAndDisplayPassword();
});

// Load Previous Options
const initialOptions = localStorage.getItem("mpg_options");
if (initialOptions) {
  const initialOptionsObj = parseStoredOptions(initialOptions);
  for (const item of initialOptionsObj) {
    const foundElem = document.getElementById(item.id);
    if (foundElem instanceof HTMLInputElement) {
      foundElem.vinylSelect?.setValue(item.value);
    }
  }
}

// Create Password Generator
if (!window.passwordGenerator) {
  window.passwordGenerator = new PasswordGenerator();
  window.passwordGenerator.addKeyboard(iPhoneKeyboard);
  window.passwordGenerator.addKeyboard(androidKeyboard);
}

generateAndDisplayPassword();
