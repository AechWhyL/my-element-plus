export type TooltipTriggerType = "click" | "hover" | "focus";
export interface TooltipTriggerProps {
  trigger?: TooltipTriggerType;
  showDelay?: number;
  hideDelay?: number;
}
