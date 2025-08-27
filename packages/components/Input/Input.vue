<template>
  <div :class="inputWrapperClasses">
    <!-- 前缀插槽 -->
    <span v-if="$slots.prefix" class="h-input__prefix">
      <slot name="prefix" />
    </span>

    <div class="h-input__inner-wrapper">
      <input
        v-if="type !== 'textarea'"
        ref="inputRef"
        :class="inputClasses"
        :type="inputType"
        :value="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :autocomplete="autocomplete"
        :autofocus="autofocus"
        :form="form"
        :name="name"
        :tabindex="tabindex"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @keyup="handleKeyup"
      />
      <textarea
        v-else
        ref="textareaRef"
        :class="inputClasses"
        :value="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :autocomplete="autocomplete"
        :autofocus="autofocus"
        :form="form"
        :name="name"
        :tabindex="tabindex"
        :rows="rows"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @keyup="handleKeyup"
      />
    </div>

    <!-- 后缀插槽 -->
    <span v-if="$slots.suffix" class="h-input__suffix">
      <slot name="suffix" />
    </span>

    <!-- 清除按钮 -->
    <span
      v-if="clearable && inputValue && !disabled"
      class="h-input__clear"
      @click="handleClear"
    >
      <ErIcon icon="circle-xmark" />
    </span>

    <!-- 密码显示切换 -->
    <span
      v-if="showPassword && inputValue && !disabled"
      class="h-input__password-toggle"
      @click="togglePasswordVisibility"
    >
      <ErIcon :icon="inputState.passwordVisible ? 'eye' : 'eye-slash'" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted, inject, watch } from "vue";
import { FORM_ITEM_CONTEXT_KEY } from "../Form/constants";
import type { InputProps, InputEmits } from "./types.js";
import { useKeyEvents } from "../../hooks/useKeyEvents";
import ErIcon from "../Icon/Icon.vue";

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  size: "default",
  disabled: false,
  readonly: false,
  clearable: false,
  round: false,
  showWordLimit: false,
  autofocus: false,
  showPassword: false,
  validateEvent: true,
  rows: 2,
});

const emit = defineEmits<InputEmits>();
const formContext = inject(FORM_ITEM_CONTEXT_KEY, null);

const inputRef = ref<HTMLInputElement>();
const textareaRef = ref<HTMLTextAreaElement>();

// 响应式状态
const inputState = reactive({
  focused: false,
  hovering: false,
  isComposing: false,
  passwordVisible: false,
});

// 使用键盘事件hook
const { bindKeyboardEvents } = useKeyEvents({
  target: computed(() => inputRef.value || null),
  keys: ["Enter", "Escape"],
  onKeyDown: {
    Enter: (event: KeyboardEvent) => {
      emit("enter", event);
    },
    Escape: (_event: KeyboardEvent) => {
      // 可以在这里添加Escape键的处理逻辑
      // 比如清空输入框或失去焦点
      inputRef.value?.blur();
    },
  },
});

// 计算属性
const inputValue = computed({
  get: () => {
    return props.modelValue || "";
  },
  set: (value: string) => {
    // 始终emit update:modelValue，让父组件决定是否使用
    emit("update:modelValue", value);
  },
});

const inputType = computed(() => {
  if (props.showPassword || props.type === "password") {
    return inputState.passwordVisible ? "text" : "password";
  }
  // 对于textarea类型，不返回type属性
  if (props.type === "textarea") {
    return undefined;
  }
  return props.type;
});

const inputWrapperClasses = computed(() => [
  "h-input-wrapper",
  `h-input-wrapper--${props.size}`,
  {
    "is-focused": inputState.focused,
    "is-disabled": props.disabled,
    "is-readonly": props.readonly,
    "is-round": props.round,
  },
]);

const inputClasses = computed(() => [
  "h-input",
  `h-input--${props.size}`,
  {
    "is-focused": inputState.focused,
    "is-disabled": props.disabled,
    "is-readonly": props.readonly,
  },
]);

// 事件处理
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  const value = target.value;

  emit("input", value);
  emit("update:modelValue", value);
  if (props.validateEvent) {
    formContext?.onValidateTrigger("change", value);
  }
};

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  const value = target.value;
  
  emit("change", value);
  
  // 在change事件后触发表单校验
  if (props.validateEvent) {
    formContext?.onValidateTrigger("change", value);
  }
};

const handleFocus = (event: FocusEvent) => {
  inputState.focused = true;
  emit("focus", event);
};

const handleBlur = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  inputState.focused = false;
  emit("blur", event);
  if (props.validateEvent) {
    formContext?.onValidateTrigger("blur", target.value);
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  emit("keydown", event);
};

const handleKeyup = (event: KeyboardEvent) => {
  emit("keyup", event);
};

const handleClear = () => {
  emit("clear");
  emit("update:modelValue", "");
};

const togglePasswordVisibility = () => {
  inputState.passwordVisible = !inputState.passwordVisible;
};

// 组件挂载后绑定键盘事件
onMounted(() => {
  bindKeyboardEvents();
});
</script>

<style lang="scss">
@import "./style.scss";
</style>
