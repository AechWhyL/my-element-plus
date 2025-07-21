import type { Ref, InjectionKey } from "vue";
import type { CollapseItemName } from "./types";

export interface CollapseContext {
  activeNames: Ref<CollapseItemName[]>;
  handleItemClick: (name: CollapseItemName) => void;
}

export const COLLAPSE_CTX_KEY: InjectionKey<CollapseContext> =
  Symbol("collapseContext");
