import type { CSSProperties, Ref } from "vue";
import type {
  RuleItem,
  ValidateFieldsError,
  ValidateResult,
} from "async-validator";
import type { Arrayable } from "@hyl-fake-element-plus/utils";

export type FormItemValidateStatus =
  | "success"
  | "error"
  | "warning"
  | "validating"
  | "";
export type FormItemTrigger = "blur" | "change";

export interface FormItemRule extends RuleItem {
  trigger?: Arrayable<FormItemTrigger>;
}
export interface FormRules {
  [key: string]: Arrayable<FormItemRule>;
}

export interface FormItemProps {
  label?: string;
  labelWidth?: CSSProperties["width"] | "auto";
  prop?: string;
  rules?: Arrayable<FormItemRule>;
  showMessage?: boolean;
  labelPosition?: "left" | "right" | "top" | "bottom";
}

export interface FormItemContext {
  validateStatus: Ref<FormItemValidateStatus>;
  onValidateTrigger: (trigger: FormItemTrigger, value?: any) => void;
}

export interface InternalFormItemContext {
  el: HTMLElement;
  updateLabelWidth: (maxWidth: number) => void;
}

export interface FormContext {
  rules: Ref<FormRules | undefined>;
  validateErrors: Ref<ValidateFieldsError | undefined>;
  validateFieldErrors: Ref<ValidateFieldsError | undefined>;
  labelWidth?: FormItemProps["labelWidth"];
  validateField: (prop: string, cb?: FormValidateCallback) => void;
  disabled?: Ref<boolean>;
  addFormItemContext: (context: InternalFormItemContext) => number;
  removeFormItemContext: (index: number) => void;
}

export interface FormProps {
  model?: Record<string, any>;
  rules?: FormRules;
  validateOnRuleChange?: boolean;
  labelWidth?: FormItemProps["labelWidth"];
}

export interface FormEmits {
  (e: "validate", result: FormValidateEvent): void;
}

export interface FormExpose {
  validate: (cb?: FormValidateCallback) => Promise<ValidateResult>;
  validateField: (prop: string, cb?: FormValidateCallback) => Promise<void>;
  clearValidate: (props?: Arrayable<string>) => void;
}

export interface FormValidateCallback {
  (valid: boolean, errFields?: ValidateFieldsError): void;
}

export interface FormValidateEvent {
  valid: boolean;
  fields: ValidateFieldsError;
}
