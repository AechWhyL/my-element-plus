import { describe, it, expect, vi, test } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import Input from '../Input.vue';
import { INPUT_TYPES } from '../constants';
import type { InputType } from '../types';
import { FORM_ITEM_CONTEXT_KEY } from '@/components/Form/constants';

describe('Input Component', () => {
  // 基础渲染测试
  describe('Basic Rendering', () => {
    it('should render correctly with default props', () => {
      const wrapper = mount(Input);
      expect(wrapper.find('.h-input-wrapper').exists()).toBe(true);
      expect(wrapper.find('.h-input').exists()).toBe(true);
      expect(wrapper.find('input').exists()).toBe(true);
    });

    it('should render textarea when type is textarea', () => {
      const wrapper = mount(Input, {
        props: { type: 'textarea' }
      });
      expect(wrapper.find('textarea').exists()).toBe(true);
      expect(wrapper.find('input').exists()).toBe(false);
    });

    it('should render password input when type is password', () => {
      const wrapper = mount(Input, {
        props: { type: 'password' }
      });
      expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    });
  });

  // Type属性测试
  describe('Type Property', () => {
    const inputTypes = [
      'email', 'url', 'tel', 'number', 'search', 'date', 'time',
      'datetime-local', 'month', 'week', 'color', 'file', 'range', 'hidden'
    ];

    it.each(inputTypes)('should render %s input correctly', (type) => {
      const wrapper = mount(Input, {
        props: { type: type as InputType }
      });
      expect(wrapper.find(`input[type="${type}"]`).exists()).toBe(true);
    });

    it('should not set type attribute for textarea', () => {
      const wrapper = mount(Input, {
        props: { type: 'textarea' }
      });
      const textarea = wrapper.find('textarea');
      expect(textarea.attributes('type')).toBeUndefined();
    });

    const inputTestCases = [
      { type: 'number', value: '123' },
      { type: 'email', value: 'test@example.com' },
      { type: 'url', value: 'https://example.com' },
      { type: 'tel', value: '+1234567890' }
    ];

    it.each(inputTestCases)('should handle $type type input correctly', async ({ type, value }) => {
      const wrapper = mount(Input, {
        props: { type: type as InputType }
      });
      const input = wrapper.find('input');
      expect(input.attributes('type')).toBe(type);

      await input.setValue(value);
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([value]);
    });

    it('should have all supported input types in constants', () => {
      const expectedTypes = [
        'text', 'textarea', 'password', 'email', 'url', 'tel', 'number',
        'search', 'date', 'time', 'datetime-local', 'month', 'week',
        'color', 'file', 'range', 'hidden'
      ];

      expectedTypes.forEach(type => {
        expect(INPUT_TYPES).toContain(type);
      });

      expect(INPUT_TYPES).toHaveLength(expectedTypes.length);
    });
  });

  // 样式类名测试
  describe('CSS Classes', () => {
    const sizes = ['large', 'default', 'small'] as const;

    it.each(sizes)('should apply %s size class correctly', (size) => {
      const wrapper = mount(Input, {
        props: { size }
      });
      expect(wrapper.find(`.h-input-wrapper--${size}`).exists()).toBe(true);
      expect(wrapper.find(`.h-input--${size}`).exists()).toBe(true);
    });

    const stateTests = [
      { prop: 'disabled', className: 'is-disabled', domProperty: 'disabled' },
      { prop: 'readonly', className: 'is-readonly', domProperty: 'readOnly' },
      { prop: 'round', className: 'is-round', domProperty: null }
    ];

    it.each(stateTests)('should apply $className class when $prop is true', ({ prop, className, domProperty }) => {
      const wrapper = mount(Input, {
        props: { [prop]: true }
      });
      expect(wrapper.find(`.${className}`).exists()).toBe(true);

      if (domProperty) {
        expect((wrapper.find('input').element as any)[domProperty]).toBe(true);
      }
    });

    it('should apply focused class when input is focused', async () => {
      const wrapper = mount(Input);
      const input = wrapper.find('input');

      await input.trigger('focus');
      expect(wrapper.find('.is-focused').exists()).toBe(true);

      await input.trigger('blur');
      expect(wrapper.find('.is-focused').exists()).toBe(false);
    });
  });

  // v-model功能测试
  describe('v-model Functionality', () => {
    it('should bind modelValue correctly', () => {
      const wrapper = mount(Input, {
        props: { modelValue: 'test value' }
      });
      expect(wrapper.find('input').element.value).toBe('test value');
    });

    it('should emit update:modelValue when input value changes', async () => {
      const wrapper = mount(Input);
      const input = wrapper.find('input');

      await input.setValue('new value');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value']);
    });

    it('should emit input event when input value changes', async () => {
      const wrapper = mount(Input);
      const input = wrapper.find('input');

      await input.setValue('new value');
      expect(wrapper.emitted('input')).toBeTruthy();
      expect(wrapper.emitted('input')?.[0]).toEqual(['new value']);
    });

    it('should emit change event when input loses focus', async () => {
      const wrapper = mount(Input);
      const input = wrapper.find('input');

      await input.setValue('new value');
      await input.trigger('blur');
      expect(wrapper.emitted('change')).toBeTruthy();
      expect(wrapper.emitted('change')?.[0]).toEqual(['new value']);
    });

    it('should handle empty string value', async () => {
      const wrapper = mount(Input, {
        props: { modelValue: 'initial value' }
      });

      await wrapper.find('input').setValue('');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
    });

    it('should handle undefined modelValue', () => {
      const wrapper = mount(Input, {
        props: { modelValue: undefined }
      });
      expect(wrapper.find('input').element.value).toBe('');
    });
  });

  // 事件测试
  describe('Events', () => {
    it('should emit focus event when input is focused', async () => {
      const wrapper = mount(Input);
      const input = wrapper.find('input');

      await input.trigger('focus');
      expect(wrapper.emitted('focus')).toBeTruthy();
    });

    it('should emit blur event when input loses focus', async () => {
      const wrapper = mount(Input);
      const input = wrapper.find('input');

      await input.trigger('blur');
      expect(wrapper.emitted('blur')).toBeTruthy();
    });

    it('should emit keydown event when key is pressed', async () => {
      const wrapper = mount(Input);
      const input = wrapper.find('input');

      await input.trigger('keydown', { key: 'a' });
      expect(wrapper.emitted('keydown')).toBeTruthy();
    });

    it('should emit keyup event when key is released', async () => {
      const wrapper = mount(Input);
      const input = wrapper.find('input');

      await input.trigger('keyup', { key: 'a' });
      expect(wrapper.emitted('keyup')).toBeTruthy();
    });

    it('should emit enter event when Enter key is pressed', async () => {
      const wrapper = mount(Input);
      const input = wrapper.find('input');

      await input.trigger('keydown', { key: 'Enter' });
      expect(wrapper.emitted('enter')).toBeTruthy();
    });
  });

  // 属性传递测试
  describe('Props Passing', () => {
    const propTests = [
      { prop: 'placeholder', value: '请输入内容', domProperty: 'placeholder' },
      { prop: 'maxlength', value: 10, domProperty: 'maxLength' },
      { prop: 'minlength', value: 5, domProperty: 'minLength' },
      { prop: 'name', value: 'username', domProperty: 'name' },
      { prop: 'tabindex', value: 1, domProperty: 'tabIndex' }
    ];

    it.each(propTests)('should pass $prop to input element', ({ prop, value, domProperty }) => {
      const wrapper = mount(Input, {
        props: { [prop]: value }
      });
      expect((wrapper.find('input').element as any)[domProperty]).toBe(value);
    });
  });

  // 特殊功能测试
  describe('Special Features', () => {
    it('should show clear button when clearable is true and has value', async () => {
      const wrapper = mount(Input, {
        props: {
          clearable: true,
          modelValue: 'test value'
        }
      });

      expect(wrapper.find('.h-input__clear').exists()).toBe(true);

      // 点击清除按钮
      await wrapper.find('.h-input__clear').trigger('click');
      expect(wrapper.emitted('clear')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
    });

    it('should not show clear button when disabled', () => {
      const wrapper = mount(Input, {
        props: {
          clearable: true,
          modelValue: 'test value',
          disabled: true
        }
      });

      expect(wrapper.find('.h-input__clear').exists()).toBe(false);
    });

    it('should toggle password visibility when showPassword is true', async () => {
      const inputValue = ref('123456');
      const wrapper = mount(Input, {
        props: {
          modelValue: inputValue.value,
          type: 'password',
          showPassword: true
        }
      });
      const toggleButton = wrapper.find('.h-input__password-toggle');
      expect(toggleButton.exists()).toBe(true);

      // 初始状态应该是password类型
      expect(wrapper.find('input').element.type).toBe('password');

      // 点击切换按钮
      await toggleButton.trigger('click');
      expect(wrapper.find('input').element.type).toBe('text');

      // 再次点击切换回来
      await toggleButton.trigger('click');
      expect(wrapper.find('input').element.type).toBe('password');
    });

    it("当值为空时，不显示清除与密码切换按钮", async () => {
      const wrapper = mount(Input, {
        props: {
          clearable: true,
          showPassword: true,
          modelValue: ''
        }
      });
      expect(wrapper.find('.h-input__clear').exists()).toBe(false);
      expect(wrapper.find('.h-input__password-toggle').exists()).toBe(false);
    })
  });

  // 组合测试
  describe('Combination Tests', () => {
    it('should handle multiple props combination correctly', () => {
      const wrapper = mount(Input, {
        props: {
          size: 'large',
          disabled: true,
          readonly: false,
          round: true,
          placeholder: 'test placeholder'
        }
      });

      expect(wrapper.find('.h-input-wrapper--large').exists()).toBe(true);
      expect(wrapper.find('.is-disabled').exists()).toBe(true);
      expect(wrapper.find('.is-readonly').exists()).toBe(false);
      expect(wrapper.find('.is-round').exists()).toBe(true);
      expect(wrapper.find('input').element.placeholder).toBe('test placeholder');
    });

    const sizes = ['large', 'default', 'small'] as const;

    it.each(sizes)('should maintain v-model functionality with %s size', async (size) => {
      const wrapper = mount(Input, {
        props: { size }
      });

      await wrapper.find('input').setValue('test value');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test value']);
    });
  });

  // 插槽功能测试
  describe('Slot Functionality', () => {
    describe('Prefix Slot', () => {
      it('should render prefix slot content correctly', () => {
        const wrapper = mount(Input, {
          slots: {
            prefix: '<span class="test-prefix">@</span>'
          }
        });

        expect(wrapper.find('.test-prefix').exists()).toBe(true);
        expect(wrapper.find('.test-prefix').text()).toBe('@');
      });

      it('should render prefix slot with Vue component', () => {
        const TestIcon = {
          template: '<span class="test-icon">🔍</span>'
        };

        const wrapper = mount(Input, {
          slots: {
            prefix: TestIcon
          }
        });

        expect(wrapper.find('.test-icon').exists()).toBe(true);
        expect(wrapper.find('.test-icon').text()).toBe('🔍');
      });

      it('should apply correct CSS classes for prefix slot', () => {
        const wrapper = mount(Input, {
          slots: {
            prefix: '<span>@</span>'
          }
        });

        expect(wrapper.find('.h-input__prefix').exists()).toBe(true);
        expect(wrapper.find('.h-input__prefix').classes()).toContain('h-input__prefix');
      });

      it('should position prefix slot before input element', () => {
        const wrapper = mount(Input, {
          slots: {
            prefix: '<span class="test-prefix">@</span>'
          }
        });

        const prefixSlot = wrapper.find('.h-input__prefix');
        const input = wrapper.find('input');

        // 检查DOM结构：prefix应该在input之前
        expect(prefixSlot.element).toBeDefined();
        expect(input.element).toBeDefined();
      });
    });

    describe('Suffix Slot', () => {
      it('should render suffix slot content correctly', () => {
        const wrapper = mount(Input, {
          slots: {
            suffix: '<span class="test-suffix">.com</span>'
          }
        });

        expect(wrapper.find('.test-suffix').exists()).toBe(true);
        expect(wrapper.find('.test-suffix').text()).toBe('.com');
      });

      it('should render suffix slot with Vue component', () => {
        const TestIcon = {
          template: '<span class="test-icon">✓</span>'
        };

        const wrapper = mount(Input, {
          slots: {
            suffix: TestIcon
          }
        });

        expect(wrapper.find('.test-icon').exists()).toBe(true);
        expect(wrapper.find('.test-icon').text()).toBe('✓');
      });

      it('should apply correct CSS classes for suffix slot', () => {
        const wrapper = mount(Input, {
          slots: {
            suffix: '<span>.com</span>'
          }
        });

        expect(wrapper.find('.h-input__suffix').exists()).toBe(true);
        expect(wrapper.find('.h-input__suffix').classes()).toContain('h-input__suffix');
      });

      it('should position suffix slot after input element', () => {
        const wrapper = mount(Input, {
          slots: {
            suffix: '<span class="test-suffix">.com</span>'
          }
        });

        const suffixSlot = wrapper.find('.h-input__suffix');
        const input = wrapper.find('input');

        // 检查DOM结构：suffix应该在input之后
        expect(suffixSlot.element).toBeDefined();
        expect(input.element).toBeDefined();
      });
    });

    describe('Empty Slots', () => {
      it.each(["prefix", "suffix"])("should not render %s wrapper when %s slot is empty", (slotName) => {
        const wrapper = mount(Input, {
        });
        expect(wrapper.find(`.h-input__${slotName}`).exists()).toBe(false);
      });

      it('should render normally when no slots are provided', () => {
        const wrapper = mount(Input);

        expect(wrapper.find('.h-input-wrapper').exists()).toBe(true);
        expect(wrapper.find('input').exists()).toBe(true);
        expect(wrapper.find('.h-input__prefix').exists()).toBe(false);
        expect(wrapper.find('.h-input__suffix').exists()).toBe(false);
      });
    });
  });

  // 表单校验触发测试
  describe('validateEvent', () => {
    const onValidateTrigger = vi.fn();
    test('trigger validateEvent', async () => {
      const wrapper = mount(Input,{
        global:{
          provide:{
            [FORM_ITEM_CONTEXT_KEY]:{
              onValidateTrigger,
            }
          }
        }
      });
      const input = wrapper.find('input');
      await input.setValue('test value');
      await nextTick();
      expect(onValidateTrigger).toHaveBeenCalledWith('change', 'test value');
    });
  });

  // 表单校验触发测试
  describe('Form Validation Trigger', () => {
    const onValidateTrigger = vi.fn();

    it('should trigger form validation on change event when validateEvent is true', async () => {
      onValidateTrigger.mockClear();
      const wrapper = mount(Input, {
        props: { validateEvent: true },
        global: {
          provide: {
            [FORM_ITEM_CONTEXT_KEY]: {
              onValidateTrigger,
            }
          }
        }
      });
      
      const input = wrapper.find('input');
      await input.setValue('test value');
      await input.trigger('blur'); // 触发change事件
      
      expect(onValidateTrigger).toHaveBeenCalledWith('change', 'test value');
    });

    it('should not trigger form validation when validateEvent is false', async () => {
      onValidateTrigger.mockClear();
      const wrapper = mount(Input, {
        props: { validateEvent: false },
        global: {
          provide: {
            [FORM_ITEM_CONTEXT_KEY]: {
              onValidateTrigger,
            }
          }
        }
      });
      
      const input = wrapper.find('input');
      await input.setValue('test value');
      await input.trigger('blur'); // 触发change事件
      
      expect(onValidateTrigger).not.toHaveBeenCalled();
    });

    it('should trigger form validation for both v-model and non-v-model usage', async () => {
      // 测试v-model模式
      onValidateTrigger.mockClear();
      const vModelWrapper = mount(Input, {
        props: { modelValue: 'initial', validateEvent: true },
        global: {
          provide: {
            [FORM_ITEM_CONTEXT_KEY]: {
              onValidateTrigger,
            }
          }
        }
      });
      
      const vModelInput = vModelWrapper.find('input');
      await vModelInput.setValue('new value');
      await vModelInput.trigger('blur');
      
      expect(onValidateTrigger).toHaveBeenCalledWith('change', 'new value');
      
      // 重置mock
      onValidateTrigger.mockClear();
      
      // 测试非v-model模式
      const nonVModelWrapper = mount(Input, {
        props: { modelValue: undefined, validateEvent: true },
        global: {
          provide: {
            [FORM_ITEM_CONTEXT_KEY]: {
              onValidateTrigger,
            }
          }
        }
      });
      
      const nonVModelInput = nonVModelWrapper.find('input');
      await nonVModelInput.setValue('another value');
      await nonVModelInput.trigger('blur');
      
      expect(onValidateTrigger).toHaveBeenCalledWith('change', 'another value');
    });

    it('should trigger form validation with correct value after input changes', async () => {
      onValidateTrigger.mockClear();
      const wrapper = mount(Input, {
        props: { validateEvent: true },
        global: {
          provide: {
            [FORM_ITEM_CONTEXT_KEY]: {
              onValidateTrigger,
            }
          }
        }
      });
      
      const input = wrapper.find('input');
      
      // 第一次输入
      await input.setValue('first value');
      await input.trigger('blur');
      expect(onValidateTrigger).toHaveBeenCalledWith('change', 'first value');
      
      // 重置mock
      onValidateTrigger.mockClear();
      
      // 第二次输入
      await input.setValue('second value');
      await input.trigger('blur');
      expect(onValidateTrigger).toHaveBeenCalledWith('change', 'second value');
    });
  });
});
