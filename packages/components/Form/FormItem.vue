<template>
  <div
    class="h-form-item"
    :class="[`h-form-item--label-${labelPosition}`]"
    ref="formItemRef"
  >
    <div class="h-form-item__label-wrapper" :style="computedLabelWrapperStyle">
      <label
        v-if="label"
        :style="{ width: labelWidth }"
        class="h-form-item-label"
      >
        {{ label }}
      </label>
    </div>
    <div class="h-form-item-content">
      <div class="h-form-item-content-inner">
        <slot></slot>
      </div>
      <MessageTransition>
        <div v-show="messageVisible" class="h-form-item-message">
          {{ message }}
        </div>
      </MessageTransition>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  unref,
  watch,
} from "vue";
import type { FormItemProps, FormItemTrigger } from "./type";
import { FORM_CONTEXT_KEY, FORM_ITEM_CONTEXT_KEY } from "./constants";
import { isArray, merge } from "lodash-es";
import MessageTransition from "./MessageTransition.vue";
defineOptions({
  name: "HFormItem",
});
const props = withDefaults(defineProps<FormItemProps>(), {
  showMessage: true,
  labelPosition: "left",
});
const formItemRef = ref<HTMLElement | null>(null);
const validateStatus = ref<"error" | "success">("success");
const formContext = inject(FORM_CONTEXT_KEY, undefined)!;
const rules = computed(() => {
  if (!formContext.rules.value || !props.prop) return [];
  return formContext.rules.value[props.prop];
});
const maxLabelWrapperWidth = ref<number>();

let itemIndex: number | undefined;

const validateErrors = computed(() => {
  if (!props.prop) return;
  return formContext.validateFieldErrors?.value?.[props.prop];
});

const message = computed(() => {
  return validateErrors.value?.[0]?.message;
});

const messageVisible = computed(() => {
  return props.showMessage && validateErrors.value?.length;
});

const updateLabelWidth = (maxWidth: number) => {
  maxLabelWrapperWidth.value = maxWidth;
};

const labelWidth = computed(() => {
  if (props.labelWidth !== undefined) return props.labelWidth;
  if (formContext?.labelWidth) return formContext.labelWidth;
  return;
});

const computedLabelWrapperStyle = computed(() => {
  console.log("maxLabelWrapperWidth.value", maxLabelWrapperWidth.value);
  if (!maxLabelWrapperWidth.value) return {};
  console.log({
    width: maxLabelWrapperWidth.value,
  });
  return {
    width: maxLabelWrapperWidth.value + "px",
  };
});

const onValidateTrigger = (trigger: FormItemTrigger) => {
  if (!unref(rules) || !props.prop) return;
  let itemRules = unref(rules);
  if (!isArray(itemRules)) {
    itemRules = [itemRules];
  }
  itemRules.forEach((rule) => {
    if (rule.trigger === trigger || rule.trigger?.includes(trigger)) {
      formContext.validateField(props.prop!, (valid) => {
        validateStatus.value = valid ? "success" : "error";
      });
    }
  });
};

provide(FORM_ITEM_CONTEXT_KEY, {
  validateStatus,
  onValidateTrigger,
});

watch(
  () => props.rules,
  (val) => {
    if (!props.prop) return;
    merge(formContext.rules.value, {
      [props.prop]: val,
    });
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  if (formItemRef.value) {
    itemIndex = formContext.addFormItemContext({
      el: formItemRef.value,
      updateLabelWidth,
    });
  }
});

onBeforeUnmount(() => {
  itemIndex && formContext.removeFormItemContext(itemIndex);
});
</script>

<style scoped></style>
