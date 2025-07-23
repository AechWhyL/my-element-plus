export interface AlertProps {
  title?: string;
  description?: string;
  type?: AlertType;
  effect?: "dark" | "light";
  showIcon?: boolean;
  closable?: boolean;
  center?: boolean;
  duration?: number;
}

export type AlertType = "success" | "info" | "warning" | "error";

export interface AlertEmits {
  (e: "close"): void;
  (e: "update:modelValue", value: boolean): void;
}

