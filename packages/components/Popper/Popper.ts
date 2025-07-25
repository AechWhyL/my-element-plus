import type { InjectionKey, Ref } from "vue";
import type { Instance } from "@popperjs/core";
export interface PopperContext {
  triggerRef: Ref<HTMLElement>;
  contentRef: Ref<HTMLElement>;
  popperJsInstance: Ref<Instance>;
}

export const POPPER_CTX_KEY: InjectionKey<PopperContext> =
  Symbol("POPPER_CTX_KEY");
