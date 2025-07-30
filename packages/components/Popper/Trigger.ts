import type Popper from "./Popper.vue";

export interface PopperTriggerProps {
  onClick?: (e: Event) => void;
  onContextmenu?: (e: Event) => void;
  onMouseenter?: (e: Event) => void;
  onMouseleave?: (e: Event) => void;
  onFocus?: (e: Event) => void;
  onBlur?: (e: Event) => void;

  virtualTrigger?: boolean;
  virtualRef?: HTMLElement;
}

export type PopperInstance = InstanceType<typeof Popper>;
