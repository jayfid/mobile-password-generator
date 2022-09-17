// create html selectbox
// @return - new vinylSelect

const handleClickWhileOpen = (e) => {
  const parentFound = e.target.closest(".processed-select-style");
  if (!parentFound) {
    document.querySelectorAll(".processed-select-style").forEach((item) => {
      item.classList.remove("show");
    });
    document.body.removeEventListener("click", handleClickWhileOpen, true);
  }
};

class VinylSelect {
  constructor(elem) {
    this.elem = elem;
    this.elem.classList.add("processed-select-style");
    this.hiddenElem = this.elem.querySelector(".select-style-input");
    this.hiddenElem.vinylSelect = this;
    this.defaultValue = this.elem.querySelector(".select-style-default");
    this.displayText = this.elem.querySelector(".select-style-value");
    this.open = false;
    this.updateValue(this.defaultValue);
    this.init();
    this.clickInit();
    this.changeInit();
  }

  updateValue(option) {
    this.hiddenElem.value = option.dataset.value;
    this.displayText.innerHTML = option.innerHTML;
    this.elem
      .querySelectorAll("p")
      .forEach((item) => item.classList.remove("select-style-default"));
    option.classList.add("select-style-default");
  }

  getValue() {
    return this.hiddenElem.value;
  }

  setValue(value) {
    this.elem.querySelectorAll("p").forEach((item) => {
      if (value === item.dataset.value) this.updateValue(item);
    });
  }

  init() {
    const defaultText = this.elem.querySelector(".select-style-default");
    if (defaultText) {
      const selectedValueElem = this.elem.querySelector(".select-style-value");
      selectedValueElem.innerHTML = defaultText.innerHTML;
    }
    return this;
  }

  close() {
    this.elem.classList.remove("show");
  }

  clickInit() {
    this.elem
      .querySelector(".select-style-inner")
      .addEventListener("click", () => {
        this.elem.classList.toggle("show");
        this.open = this.elem.classList.contains("show");
        if (this.open) {
          document.body.addEventListener("click", handleClickWhileOpen, true);
        } else {
          document.body.removeEventListener(
            "click",
            handleClickWhileOpen,
            true
          );
        }
      });
  }

  changeInit() {
    const handlerFunction = (e) => {
      const valueChanged = (this.getValue() !== e.target.dataset.value);
      this.updateValue(e.target);
      this.close();
      if (!valueChanged) {
        return;
      }
      const ev = new Event("vinylSelectUpdate", {
        bubbles: true,
        cancelable: true,
      });
      document.body.dispatchEvent(ev);
    };
    this.elem.querySelectorAll("p").forEach((item) => {
      item.addEventListener("click", handlerFunction);
    });
  }
}

export default VinylSelect;
