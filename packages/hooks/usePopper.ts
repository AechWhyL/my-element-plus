import {
  type State,
  type Modifier,
  type Options,
  createPopper,
  type Instance,
} from "@popperjs/core";
import {
  onBeforeUnmount,
  ref,
  type Ref,
  shallowRef,
  unref,
  watch,
  computed,
} from "vue";
import { fromPairs } from "lodash-es";

/**
 * @description 获取popper.js计算后的style，自行赋给元素,比如延迟等
 * @param referenceRef 触发元素的ref
 * @param popperContentRef 弹出元素的ref
 * @param options
 * @returns
 */
export const usePopper = (
  referenceRef: Ref<HTMLElement>,
  popperContentRef: Ref<HTMLElement>,
  options: Partial<Options> | Options = {}
) => {
  const StateModifier: Modifier<"getState", {}> = {
    name: "getState",
    phase: "afterWrite",
    enabled: true,
    fn({ state }) {
      Object.assign(pickedStates.value, pickStates(state));
    },
    requires: ["computeStyles"],
  };

  const popperInstanceRef = shallowRef<Instance>();
  const pickedStates = ref<Pick<State, "styles" | "attributes">>({
    styles: {
      popper: {
        position: unref(options).strategy,
        left: "0",
        top: "0",
      },
      arrow: {
        position: "absolute",
      },
    },
    attributes: {},
  });

  const computedOpts = computed<Options>(() => {
    const { placement, strategy, modifiers } = options;
    return {
      placement: placement || "bottom",
      strategy: strategy || "absolute",
      modifiers: [
        ...(modifiers || []),
        StateModifier,
        { name: "applyStyles", enabled: false },
      ],
    };
  });

  const destory = () => {
    const instance = unref(popperInstanceRef);
    if (instance) {
      instance.destroy();
    }
  };

  watch(
    computedOpts,
    (newOptions) => {
      const instance = unref(popperInstanceRef);
      if (instance) {
        instance.setOptions({
          ...newOptions,
        });
      }
    },
    { deep: true }
  );

  watch([referenceRef, popperContentRef], ([reference, popperContent]) => {
    destory();
    if (!reference || !popperContent) {
      return;
    }
    popperInstanceRef.value = createPopper(reference, popperContent, {
      ...options,
      modifiers: [StateModifier, ...(options.modifiers || [])],
    });
  });

  onBeforeUnmount(() => {
    destory();
  });

  return {
    styles: computed(() => unref(pickedStates).styles),
    attributes: computed(() => unref(pickedStates).attributes),
    popperInstanceRef: computed(() => unref(popperInstanceRef)),
  };
};

function pickStates(state: State) {
  const elements = Object.keys(
    state.elements
  ) as unknown as (keyof State["elements"])[];

  const styles = fromPairs(elements.map((key) => [key, state.styles[key]]));
  const attributes = fromPairs(
    elements.map((key) => [key, state.attributes[key]])
  );

  return {
    styles,
    attributes,
  };
}
