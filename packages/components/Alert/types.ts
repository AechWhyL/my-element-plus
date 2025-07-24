export interface AlertProps {
  title?: string;
  description?: string;
  type?: AlertType;
  effect?: "dark" | "light";
  showIcon?: boolean;
  closable?: boolean;
  center?: boolean;
}

export type AlertType = "success" | "info" | "warning" | "error";

export interface AlertEmits {
  (e: "close"): void;
  (e: "update:modelValue", value: boolean): void;
}

export interface AlertSlots {
  title?: (props: {}) => any;
  description?: (props: {}) => any;
  close?: (props: {}) => any;
  icon?: (props: {}) => any;
  default?: (props: {}) => any;
}
