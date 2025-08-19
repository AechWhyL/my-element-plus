<template>
  <div :class="inputWrapperClasses">
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
    
    <!-- 清除按钮 -->
    <span
      v-if="clearable && inputValue && !disabled"
      class="h-input__clear"
      @click="handleClear"
    >
      <i class="h-icon-close"></i>
    </span>
    
    <!-- 密码显示切换 -->
    <span
      v-if="type === 'password' && showPassword"
      class="h-input__password-toggle"
      @click="togglePasswordVisibility"
    >
      <i :class="showPassword ? 'h-icon-view' : 'h-icon-hide'"></i>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, toRefs, onMounted } from 'vue';
import type { InputProps, InputEmits } from './types.js';
import { useKeyEvents } from '../../hooks/useKeyEvents';

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  size: 'default',
  disabled: false,
  readonly: false,
  clearable: false,
  round: false,
  showWordLimit: false,
  autofocus: false,
  showPassword: false,
  rows: 2
});

const emit = defineEmits<InputEmits>();

const inputRef = ref<HTMLInputElement>();
const textareaRef = ref<HTMLTextAreaElement>();

// 响应式状态
const inputState = reactive({
  focused: false,
  hovering: false,
  isComposing: false,
  passwordVisible: false
});

// 使用键盘事件hook
const { bindKeyboardEvents } = useKeyEvents({
  target: computed(() => inputRef.value || null),
  keys: ['Enter', 'Escape'],
  onKeyDown: {
    'Enter': (event: KeyboardEvent) => {
      emit('enter', event);
    },
    'Escape': (event: KeyboardEvent) => {
      // 可以在这里添加Escape键的处理逻辑
      // 比如清空输入框或失去焦点
    }
  }
});

// 计算属性
const inputValue = computed({
  get: () => props.modelValue || '',
  set: (value: string) => emit('update:modelValue', value)
});

const inputType = computed(() => {
  if(props.showPassword || props.type === 'password'){
    return inputState.passwordVisible ? 'text' : 'password';
  }
  // 对于textarea类型，不返回type属性
  if (props.type === 'textarea') {
    return undefined;
  }
  return props.type;
});

const inputWrapperClasses = computed(() => [
  'h-input-wrapper',
  `h-input-wrapper--${props.size}`,
  {
    'is-focused': inputState.focused,
    'is-disabled': props.disabled,
    'is-readonly': props.readonly,
    'is-round': props.round
  }
]);

const inputClasses = computed(() => [
  'h-input',
  `h-input--${props.size}`,
  {
    'is-focused': inputState.focused,
    'is-disabled': props.disabled,
    'is-readonly': props.readonly
  }
]);

// 事件处理
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  const value = target.value;
  
  emit('input', value);
  emit('update:modelValue', value);
};

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  emit('change', target.value);
};

const handleFocus = (event: FocusEvent) => {
  inputState.focused = true;
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  inputState.focused = false;
  emit('blur', event);
};

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event);
};

const handleKeyup = (event: KeyboardEvent) => {
  emit('keyup', event);
};

const handleClear = () => {
  emit('clear');
  emit('update:modelValue', '');
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
@import './style.scss';
</style>
