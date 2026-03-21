// create html selectbox
// @return - new vinylSelect

const getRequiredElement = <T extends Element>(
  parent: ParentNode,
  selector: string,
): T => {
  const element = parent.querySelector<T>(selector);
  if (!element) {
    throw Error(`Required element not found: ${selector}`);
  }
  return element;
};

const handleClickWhileOpen = (e: Event): void => {
  const target = e.target;
  const parentFound =
    target instanceof Element
      ? target.closest(".processed-select-style")
      : null;

  if (!parentFound) {
    for (const item of document.querySelectorAll(".processed-select-style")) {
      item.classList.remove("show");
    }
    document.body.removeEventListener("click", handleClickWhileOpen, true);
  }
};

class VinylSelect {
  elem: HTMLElement;

  hiddenElem: HTMLInputElement;

  defaultValue: HTMLParagraphElement;

  displayText: HTMLElement;

  open: boolean;

  constructor(elem: Element) {
    if (!(elem instanceof HTMLElement)) {
      throw Error("VinylSelect requires an HTMLElement");
    }

    this.elem = elem;
    this.elem.classList.add("processed-select-style");
    this.hiddenElem = getRequiredElement<HTMLInputElement>(
      this.elem,
      ".select-style-input",
    );
    this.hiddenElem.vinylSelect = this;
    this.defaultValue = getRequiredElement<HTMLParagraphElement>(
      this.elem,
      ".select-style-default",
    );
    this.displayText = getRequiredElement<HTMLElement>(
      this.elem,
      ".select-style-value",
    );
    this.open = false;
    this.updateValue(this.defaultValue);
    this.init();
    this.clickInit();
    this.changeInit();
  }

  updateValue(option: HTMLParagraphElement): void {
    this.hiddenElem.value = option.dataset.value ?? "";
    this.displayText.innerHTML = option.innerHTML;
    for (const item of this.elem.querySelectorAll<HTMLParagraphElement>("p")) {
      item.classList.remove("select-style-default");
    }
    option.classList.add("select-style-default");
  }

  getValue(): string {
    return this.hiddenElem.value;
  }

  setValue(value: string): void {
    for (const item of this.elem.querySelectorAll<HTMLParagraphElement>("p")) {
      if (value === item.dataset.value) {
        this.updateValue(item);
      }
    }
  }

  init(): VinylSelect {
    const defaultText = this.elem.querySelector<HTMLParagraphElement>(
      ".select-style-default",
    );
    if (defaultText) {
      const selectedValueElem = getRequiredElement<HTMLElement>(
        this.elem,
        ".select-style-value",
      );
      selectedValueElem.innerHTML = defaultText.innerHTML;
    }
    return this;
  }

  close(): void {
    this.elem.classList.remove("show");
  }

  clickInit(): void {
    getRequiredElement<HTMLElement>(
      this.elem,
      ".select-style-inner",
    ).addEventListener("click", () => {
      this.elem.classList.toggle("show");
      this.open = this.elem.classList.contains("show");
      if (this.open) {
        document.body.addEventListener("click", handleClickWhileOpen, true);
      } else {
        document.body.removeEventListener("click", handleClickWhileOpen, true);
      }
    });
  }

  changeInit(): void {
    const handlerFunction = (e: Event): void => {
      const target = e.target;
      if (!(target instanceof HTMLParagraphElement)) {
        return;
      }

      const valueChanged = this.getValue() !== (target.dataset.value ?? "");
      this.updateValue(target);
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
    for (const item of this.elem.querySelectorAll<HTMLParagraphElement>("p")) {
      item.addEventListener("click", handlerFunction);
    }
  }
}

export default VinylSelect;
