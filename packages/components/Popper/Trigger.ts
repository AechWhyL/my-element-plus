import type { Ref } from "vue";

export interface TriggerProps {
  onClick?: (e: Event) => void;
  onContextmenu?: (e: Event) => void;
  onMouseenter?: (e: Event) => void;
  onMouseleave?: (e: Event) => void;
  onFocus?: (e: Event) => void;
  onBlur?: (e: Event) => void;

  virtualTrigger?: boolean;
  virtualRef?: Ref<HTMLElement>;
}
