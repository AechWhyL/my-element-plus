import { withInstall } from '@hyl-fake-element-plus/utils';
import Form from './Form.vue';
import FormItem from './FormItem.vue';

export const HForm = withInstall(Form);
export const HFormItem = withInstall(FormItem);

export default HForm;

export * from './type';
export * from './constants';
