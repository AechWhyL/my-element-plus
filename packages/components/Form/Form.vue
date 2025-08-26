<template>
  <form class="h-form">
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import type {
  FormExpose,
  FormProps,
  FormRules,
  FormValidateCallback,
} from "./type";
import Schema, { type ValidateFieldsError } from "async-validator";
import { FORM_CONTEXT_KEY } from "./constants";
import { provide, ref, unref, watch } from "vue";
import { isArray, pick } from "lodash-es";
import type { Arrayable } from "@/utils";

defineOptions({
  name: "HForm",
});

const props = withDefaults(defineProps<FormProps>(), {
  validateOnRuleChange: true,
});
const rules = ref<FormRules>({});
const schema = ref<Schema>();
const validateErrors = ref<ValidateFieldsError>();
const validateFieldErrors = ref<ValidateFieldsError>({});

const validate = async (cb?: FormValidateCallback) => {
  if (!unref(schema) || !props.model) return;
  return unref(schema)
    ?.validate(props.model, { suppressWarning: true })
    .then(() => {
      cb?.(true);
      validateErrors.value = undefined;
      validateFieldErrors.value = {};
    })
    .catch(({ errors, fields }) => {
      cb?.(false, fields);
      validateErrors.value = errors;
      validateFieldErrors.value = fields;
    });
};

const validateField = async (prop: string, cb?: FormValidateCallback) => {
  if (!unref(schema) || !props.model) return;
  const source = pick(props.model, prop);
  if (!source) return;
  return unref(schema)
    ?.validate(source, { suppressWarning: true })
    .then(() => {
      cb?.(true);
      validateFieldErrors.value &&
        Reflect.deleteProperty(validateFieldErrors.value, prop);
    })
    .catch(({ errors, fields }) => {
      cb?.(false, fields);
      validateErrors.value = errors;
      validateFieldErrors.value[prop] = errors;
    });
};

const clearValidate = (props?: Arrayable<string>) => {
  if (!props) {
    validateErrors.value = undefined;
    validateFieldErrors.value = {};
  } else if (isArray(props)) {
    props.forEach((prop) => {
      validateFieldErrors.value &&
        Reflect.deleteProperty(validateFieldErrors.value, prop);
    });
  } else {
    validateFieldErrors.value &&
      Reflect.deleteProperty(validateFieldErrors.value, props);
  }
};

watch(
  () => props.rules,
  (val) => {
    rules.value = val || {};
  },
  {
    immediate: true,
  }
);

watch(
  rules,
  (val) => {
    schema.value = new Schema(val);
    if (props.validateOnRuleChange) {
      validate();
    }
  },
  {
    immediate: true,
  }
);

provide(FORM_CONTEXT_KEY, {
  rules,
  validateErrors,
  validateFieldErrors,
  validateField,
});
defineExpose<FormExpose>({
  validate,
  validateField,
  clearValidate,
});
</script>

<style scoped></style>
