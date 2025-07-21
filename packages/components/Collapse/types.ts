export type CollapseItemName = string | number;

export interface CollapseProps {
  modelValue: CollapseItemName[];
  accordion?: boolean; // 是否开启手风琴模式
}

export interface CollapseItemProps {
  name: CollapseItemName;
  title?: string;
  disabled?: boolean;
}

export interface CollapseEmits {
  (e: "update:modelValue", value: CollapseItemName[]): void;
  (e: "change", value: CollapseItemName[]): void;
}


