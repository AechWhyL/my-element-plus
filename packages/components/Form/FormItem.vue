<template>
  <div class="h-form-item">
    <label
      v-if="label"
      :style="{ width: labelWidth }"
      class="h-form-item-label"
    >
      {{ label }}
    </label>
    <div class="h-form-item-content">
      <slot></slot>
      <div v-show="messageVisible" class="h-form-item-message">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, provide, ref, toRefs, unref, watch } from "vue";
import type { FormItemProps, FormItemTrigger } from "./type";
import { FORM_CONTEXT_KEY, FORM_ITEM_CONTEXT_KEY } from "./constants";
import { merge } from "lodash-es";

defineOptions({
  name: "HFormItem",
});
const props = withDefaults(defineProps<FormItemProps>(), {
  showMessage: true,
});
const validateStatus = ref<"error" | "success">("success");
const { rules } = toRefs(props);
const formContext = inject(FORM_CONTEXT_KEY, undefined)!;

const validateErrors = computed(() => {
  if (!props.prop) return;
  return formContext.validateFieldErrors?.value?.[props.prop];
});

const message = computed(() => {
  return validateErrors.value?.[0]?.message;
});

const messageVisible = computed(() => {
  return props.showMessage;
});

const onValidateTrigger = (trigger: FormItemTrigger) => {
  if (!unref(rules) || !props.prop) return;
  unref(rules)?.forEach((rule) => {
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
  rules,
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

</script>

<style scoped></style>
