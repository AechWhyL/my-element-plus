import type { CSSProperties, Reactive, Ref } from "vue";
import type {
  RuleItem,
  Rules,
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
  labelWidth?: CSSProperties["width"];
  prop?: string;
  rules?: FormItemRule[];
  showMessage?: boolean;
}

export interface FormItemContext {
  validateStatus: Ref<FormItemValidateStatus>;
  onValidateTrigger: (trigger: FormItemTrigger, value?: any) => void;
}

export interface FormContext {
  rules: Ref<FormRules | undefined>;
  validateErrors: Ref<ValidateFieldsError | undefined>;
  validateFieldErrors: Ref<ValidateFieldsError | undefined>;
  validateField: (prop: string, cb?: FormValidateCallback) => void;
  disabled?: Ref<boolean>;
}

export interface FormProps {
  model?: Record<string, any>;
  rules?: FormRules;
  validateOnRuleChange?: boolean;
}

export interface FormExpose {
  validate: (cb?: FormValidateCallback) => Promise<ValidateResult>;
  validateField: (prop: string, cb?: FormValidateCallback) => Promise<void>;
  clearValidate: (props?: Arrayable<string>) => void;
}

export interface FormValidateCallback {
  (valid: boolean, errFields?: ValidateFieldsError): void;
}
