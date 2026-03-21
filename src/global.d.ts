import type PasswordGenerator from "./scripts/generator";
import type VinylSelect from "./scripts/select";

declare global {
  interface Window {
    passwordGenerator?: PasswordGenerator;
  }

  interface HTMLInputElement {
    vinylSelect?: VinylSelect;
  }
}
