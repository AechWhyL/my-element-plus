import type { Ref } from "vue";
import { onBeforeUnmount } from "vue";

export const useClickOutside = (
  ref: Ref<HTMLElement | null>,
  callback: (e: MouseEvent) => void
) => {
  const onClick = (e: MouseEvent) => {
    if (ref.value && !ref.value.contains(e.target as Node)) {
      console.log("outside-click!")
      callback(e);
    }
  };
  document.addEventListener("mousedown", onClick);
  onBeforeUnmount(() => {
    document.removeEventListener("mousedown", onClick);
  });
};
