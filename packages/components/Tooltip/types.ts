import type { PopperContentProps } from "../Popper/Content";
import type { TooltipTriggerProps } from "./Trigger";

export type TooltipProps = PopperContentProps &
  TooltipTriggerProps & {
    showArrow?: boolean;
    transition?: string;
    enterable?: boolean;
    disabled?: boolean;
    appendTo?: string | HTMLElement;
    content?: string;
    visible?: boolean;

    virtualRef: HTMLElement;
    virtualTrigger: boolean;
  };

export type TooltipEmits = {
  (e: "update:visible", visible: boolean): void;
};
