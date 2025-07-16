import type { Component, Ref } from "vue";

export type ButtonType = "primary" | "success" | "warning" | "danger" | "info";
export type NativeType = "button" | "submit" | "reset";
export type ButtonSize = "large" | "default" | "small";

export interface ButtonProps {
  tag?: string | Component;
  type?: ButtonType;
  nativeType?: NativeType;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  plain?: boolean;
  round?: boolean;
  circle?: boolean;
  autoFocus?: boolean;
  useThrottle?: boolean;
  loadingIcon?: string;
  throttleDuration?: number;
  icon?: string;
}

export interface ButtonEmits {
  (e: "click", val: MouseEvent): void;
}

export interface ButtonGroupProps {
  size?: ButtonSize;
  type?: ButtonType;
  disabled?: boolean;
}

export interface ButtonGroupContext {
  size?: ButtonSize;
  type?: ButtonType;
  disabled?: boolean;
}

export interface ButtonInstance {
  ref: Ref<HTMLButtonElement>;
}
