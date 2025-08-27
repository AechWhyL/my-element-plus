<template>
  <form class="h-form">
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import type {
  FormEmits,
  FormExpose,
  FormProps,
  FormRules,
  FormValidateCallback,
  InternalFormItemContext,
} from "./type";
import Schema, { type ValidateFieldsError } from "async-validator";
import { FORM_CONTEXT_KEY } from "./constants";
import { provide, ref, unref, watch } from "vue";
import { isArray, pick } from "lodash-es";
import type { Arrayable } from "@hyl-fake-element-plus/utils";

defineOptions({
  name: "HForm",
});

const props = withDefaults(defineProps<FormProps>(), {
  validateOnRuleChange: true,
});

const emit = defineEmits<FormEmits>();

const rules = ref<FormRules>({});
const schema = ref<Schema>();
const validateErrors = ref<ValidateFieldsError>();
const validateFieldErrors = ref<ValidateFieldsError>({});
const formItemContexts = ref<InternalFormItemContext[]>([]);

const addFormItemContext = (context: InternalFormItemContext) => {
  formItemContexts.value.push(context);
  return formItemContexts.value.length;
};

const removeFormItemContext = (index: number) => {
  formItemContexts.value.splice(index, 1);
};

const mesureMaxFormItemWidth = () => {
  let width = 0;
  formItemContexts.value.forEach(({ el }) => {
    const label = el.querySelector(
      ".h-form-item__label-wrapper"
    ) as HTMLElement;
    if (label) {
      const originalDisplay = label.style.display;
      label.style.display = "inline-block";
      const itemWidth = label.offsetWidth;
      label.style.display = originalDisplay;
      width = Math.max(width, itemWidth);
    }
  });
  return width;
};

const updateFormItemWidth = () => {
  const maxWidth = mesureMaxFormItemWidth();;
  formItemContexts.value.forEach(({ updateLabelWidth }) => {
    updateLabelWidth(maxWidth);
  });
};

const validate = async (cb?: FormValidateCallback) => {
  if (!unref(schema) || !props.model) return;
  return unref(schema)
    ?.validate(props.model, { suppressWarning: true })
    .then(() => {
      cb?.(true);
      validateErrors.value = undefined;
      validateFieldErrors.value = {};
      emit("validate", { valid: true, fields: {} });
    })
    .catch(({ errors, fields }) => {
      cb?.(false, fields);
      validateErrors.value = errors;
      validateFieldErrors.value = fields;
      emit("validate", { valid: false, fields });
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
      emit("validate", { valid: true, fields: {} });
    })
    .catch(({ errors, fields }) => {
      cb?.(false, fields);
      validateErrors.value = errors;
      validateFieldErrors.value[prop] = fields[prop];
      emit("validate", { valid: false, fields });
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
    deep: true,
    immediate: true,
  }
);

watch(formItemContexts, () => {
  if (props.labelWidth === "auto") {
    updateFormItemWidth();
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

provide(FORM_CONTEXT_KEY, {
  rules,
  validateErrors,
  validateFieldErrors,
  validateField,
  addFormItemContext,
  removeFormItemContext,
});
defineExpose<FormExpose>({
  validate,
  validateField,
  clearValidate,
});
</script>

<style>
@import "./style.css";
</style>
