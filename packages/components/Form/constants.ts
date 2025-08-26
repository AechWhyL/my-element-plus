import type { FormContext, FormItemContext } from "./type";
import type { InjectionKey } from "vue";

export const FORM_CONTEXT_KEY: InjectionKey<FormContext> = Symbol("FORM_CONTEXT_KEY")
export const FORM_ITEM_CONTEXT_KEY: InjectionKey<FormItemContext> = Symbol("FORM_ITEM_CONTEXT_KEY")