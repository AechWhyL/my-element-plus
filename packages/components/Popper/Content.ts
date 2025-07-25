import type { Instance } from "@popperjs/core";
import type { Ref } from "vue";

export interface PopperContentProps {
  contentClass?: string;
  visible?: boolean;
}

export interface PopperContentInstance {
  popperInstanceRef: Ref<Instance | undefined>;
}

export interface PopperContentEmits {
  (e: "update:visible", visible: boolean): void;
}