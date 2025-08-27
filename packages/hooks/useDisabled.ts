import { computed, inject, ref } from "vue";
import { FORM_CONTEXT_KEY } from "@hyl-fake-element-plus/components/Form/constants";

export const useDisabled = (defaultValue: boolean = false) => {
  const disabled = ref<boolean>(defaultValue);
  const formContext = inject(FORM_CONTEXT_KEY, null);
  
  const computedDisabled = computed({
    get() {
      // 如果父组件提供了disabled context，完全由context控制
      if (formContext?.disabled !== undefined) {
        return formContext.disabled.value;
      }
      // 否则由子组件控制
      return disabled.value;
    },
    set(value: boolean) {
      // 如果父组件提供了disabled context，不允许子组件修改
      if (formContext?.disabled !== undefined) {
        return;
      }
      // 否则允许子组件修改
      disabled.value = value;
    },
  });

  return { 
    disabled: computedDisabled,
    // 为了向后兼容，也导出computedDisabled
    computedDisabled 
  };
};
