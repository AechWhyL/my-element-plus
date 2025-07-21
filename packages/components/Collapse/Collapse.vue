<script setup lang="ts">
import { COLLAPSE_CTX_KEY } from "./constants";
import type { CollapseEmits, CollapseItemName, CollapseProps } from "./types";
import { provide, ref, watch } from "vue";

defineOptions({
  name: "ErCollapse",
});

const props = defineProps<CollapseProps>();
const emits = defineEmits<CollapseEmits>();

if (props.accordion && props.modelValue.length > 1) {
  console.warn("accordion 模式下只能展开一个");
}

const activeNames = ref<CollapseItemName[]>(props.modelValue);

const handleItemClick = (name: CollapseItemName) => {
  let _activeNames = activeNames.value;
  if (props.accordion) {
    if (_activeNames.includes(name)) {
      _activeNames.length = 0;
    } else {
      _activeNames.length = 1;
      _activeNames[0] = name;
    }
    handleUpdateActiveNames(_activeNames);
    return;
  }

  if (_activeNames.includes(name)) {
    _activeNames = _activeNames.filter((item) => item !== name);
    handleUpdateActiveNames(_activeNames);
    return;
  }

  _activeNames.push(name);
  handleUpdateActiveNames(_activeNames);
};

const handleUpdateActiveNames = (val: CollapseItemName[]) => {
  activeNames.value = val;
  emits("update:modelValue", val);
  emits("change", val);
};

watch(
  () => props.modelValue,
  (val) => {
    handleUpdateActiveNames(val);
  }
);

provide(COLLAPSE_CTX_KEY, {
  activeNames,
  handleItemClick,
});
</script>

<template>
  <div class="er-collapse">
    <slot></slot>
  </div>
</template>

<style scoped>
@import url("./style.css");
</style>
