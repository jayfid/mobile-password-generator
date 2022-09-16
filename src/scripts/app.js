import {
  focusPasswordField,
  generateAndCopy,
  generateAndDisplayPassword,
  iOS,
  showCopySuccess,
  submitPasswordForm,
} from "./ui";
import VinylSelect from "./select";

document.querySelectorAll(".select-style").forEach((item) => {
  new VinylSelect(item); // eslint-disable-line no-new
});

// Buttons
const generateButton = document.querySelector("#generate");
generateButton.addEventListener("click", submitPasswordForm);

// Clipboard
document.querySelector('#password-field').addEventListener('click', () => {
  const textValue = document.querySelector('#password').value;
  navigator.clipboard.writeText(textValue).then(() => {
    showCopySuccess();
  });
});

// iOS does not allow copying via js
if (!iOS()) {
  document.querySelector(".action").classList.remove("hide");
  // create a shortcut button to generate the pw and copy it at the same time
  const copyAndGenBtn = document.createElement("button");
  copyAndGenBtn.setAttribute("type", "button");
  copyAndGenBtn.setAttribute("id", "generate-copy");
  copyAndGenBtn.className = "btn-style-a";
  copyAndGenBtn.innerHTML = "Generate and Copy to Clipboard";
  copyAndGenBtn.addEventListener("click", generateAndCopy);
  document.querySelector(".button-group").appendChild(copyAndGenBtn);
} else {
  document
    .getElementById("password-field")
    .addEventListener("click", focusPasswordField);
}

// Save options
document.body.addEventListener("vinylSelectUpdate", () => {
  const options = [{
    id: "charlen",
    value: document.getElementById("charlen").value
  },{
    id: "keyboard",
    value: document.getElementById("keyboard").value
  }];
  localStorage.setItem("mpg_options", JSON.stringify(options));
});

function initializeOptions() {
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
}
initializeOptions();

generateAndDisplayPassword();
