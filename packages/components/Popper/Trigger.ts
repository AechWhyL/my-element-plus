import type Trigger from "./Trigger.vue";

export interface PopperTriggerEvents {
  onClick?: (e: Event) => void;
  onContextmenu?: (e: Event) => void;
  onMouseenter?: (e: Event) => void;
  onMouseleave?: (e: Event) => void;
  onFocus?: (e: Event) => void;
  onBlur?: (e: Event) => void;
}

export interface PopperTriggerProps extends PopperTriggerEvents {
  virtualTrigger?: boolean;
  virtualRef?: HTMLElement;
}

export type PopperTriggerInstance = InstanceType<typeof Trigger>;
