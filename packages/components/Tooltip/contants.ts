import type { InjectionKey, Ref } from "vue";
import type { TooltipProps } from "./types";

export type TooltipContext = {
  visible: Ref<boolean>;
  controlled: () => boolean;
  shouldStop: () => boolean;
  trigger: Ref<NonNullable<TooltipProps["trigger"]>>;
  onOpen: (e: Event) => void; // 显示tooltip的方法
  onHide: (e: Event) => void; // 隐藏tooltip的方法
  onToggle: (e: Event) => void; // 切换tooltip的方法

  virtualRef: Ref<HTMLElement | undefined>;
  virtualTrigger: Ref<boolean>;
};
export const TOOLTIP_CTX_KEY: InjectionKey<TooltipContext> =
  Symbol("TOOLTIP_CTX_KEY");
