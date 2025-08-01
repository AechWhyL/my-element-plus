import type { PopperTriggerEvents } from "../Popper/Trigger";

export interface TooltipTriggerEvents extends PopperTriggerEvents {}
export type TooltipTriggerType = "click" | "hover" | "focus";
export interface TooltipTriggerProps extends TooltipTriggerEvents {
  trigger?: TooltipTriggerType;
  showDelay?: number;
  hideDelay?: number;
}
