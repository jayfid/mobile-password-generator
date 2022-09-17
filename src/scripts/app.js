import {
  generateAndCopy,
  generateAndDisplayPassword,
  showCopySuccess,
  submitPasswordForm,
} from "./ui";
import VinylSelect from "./select";

// Selects
document.querySelectorAll(".select-style").forEach((item) => {
  new VinylSelect(item); // eslint-disable-line no-new
});

// Buttons
document
  .querySelector("#generate")
  .addEventListener("click", submitPasswordForm);
document
  .querySelector("#generate-copy")
  .addEventListener("click", generateAndCopy);

// Clipboard
document.querySelector("#password-field").addEventListener("click", () => {
  const textValue = document.querySelector("#password").value;
  navigator.clipboard.writeText(textValue).then(() => {
    showCopySuccess();
  });
});

// Persist Selections
document.body.addEventListener("vinylSelectUpdate", () => {
  const options = [
    {
      id: "charlen",
      value: document.querySelector("#charlen").value,
    },
    {
      id: "keyboard",
      value: document.querySelector("#keyboard").value,
    },
  ];
  localStorage.setItem("mpg_options", JSON.stringify(options));
});

// Load Previous Options
const initialOptions = localStorage.getItem("mpg_options");
if (initialOptions) {
  const initialOptionsObj = JSON.parse(initialOptions);
  initialOptionsObj.forEach((item) => {
    const foundElem = document.getElementById(item.id);
    if (foundElem && foundElem.tagName === "INPUT") {
      foundElem.vinylSelect.setValue(item.value);
    }
  });
}

generateAndDisplayPassword();
