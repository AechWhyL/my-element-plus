<script setup lang="ts">
import { computed, useAttrs } from "vue";
import type { IconProps } from "./types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { omit } from "lodash-es";

defineOptions({
  name: "ErIcon",
  inheritAttrs: false,
});

const props = defineProps<IconProps>();
const filteredProps = computed<Omit<IconProps,"type"|"color">>(() => omit(props, ["type", "color"]));
const customStyle = computed(()=>{
    return {
        color:props.color?? void 0
    }
}) 

</script>

<template>
  <i
  class="er-icon"
  :class="{
    [`er-icon--${props.type}`]: props.type,
  }"
  v-bind = "$attrs"
  :style="customStyle"
  >
    <FontAwesomeIcon v-bind = "filteredProps" />
  </i>
</template>

<style scoped>
.er-icon{
    display: inline-block;
    font-style: normal;
    line-height: 1;
}
</style>
