import type { Instance, Options, Placement } from "@popperjs/core";
import type { CSSProperties, InjectionKey, Ref } from "vue";

export interface PopperContentProps {
  contentClass?: string;
  placement?: Placement;
  strategy?: Options["strategy"];
  offset?: number;
  popperOptions?: Partial<Options>;
  effect?: "dark" | "light";
}

export interface PopperContentInstance {
  popperInstanceRef: Ref<Instance | undefined>;
}

export interface PopperContentEmits {
  (e: "mouseenter", event: MouseEvent): void;
  (e: "mouseleave", event: MouseEvent): void;
}

export interface PopperContentCtx {
  popperInstanceRef: Ref<Instance | undefined>;
  arrowStyle: Ref<CSSProperties[]>;
  arrowAttrs: Ref<Record<string, any>>;
}

export const POPPER_CONTENT_CTX_KEY: InjectionKey<PopperContentCtx> =
  Symbol("popperContent");
