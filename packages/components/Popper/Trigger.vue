<script setup lang="ts">
import { inject, onMounted, watch, unref, onBeforeUnmount } from "vue";
import { POPPER_CTX_KEY } from "./Popper";
import type { PopperTriggerProps } from "./Trigger";

defineOptions({
  name: "HPopperTrigger",
});

const { triggerRef } = inject(POPPER_CTX_KEY, undefined)!;

const props = defineProps<PopperTriggerProps>();

const EVENT_NAMES = [
    "onClick",
    "onMouseenter",
    "onMouseleave",
    "onFocus",
    "onBlur",
] as const

const formatEventName = (eventName:string)=>{
    return eventName.slice(2).toLowerCase()
}

onMounted(() => {
  watch(
    () => props.virtualRef,
    (virtualRef) => {
      console.log(virtualRef)
      if (virtualRef) {
        triggerRef.value = unref(virtualRef);
      }
    },
    {
      immediate: true,
    }
  );

  watch(triggerRef,(el,prevEl)=>{
    if(el){
      EVENT_NAMES.forEach((eventName)=>{
        const handler = props[eventName]
        if(handler){
            el.addEventListener(formatEventName(eventName),handler)
            prevEl?.removeEventListener(formatEventName(eventName),handler)
        }
      })
    }
  },{
    immediate:true
  })

  onBeforeUnmount(()=>{
    if(triggerRef.value){
      EVENT_NAMES.forEach((eventName)=>{
        const handler = props[eventName]
        if(handler){
            triggerRef.value.removeEventListener(formatEventName(eventName),handler)
        }
      })
    }
  })
});

defineExpose({
    triggerRef
})
</script>

<template>
  <div v-if="!virtualTrigger" ref="triggerRef" v-bind="$attrs" tabindex="0">
    <slot></slot>
  </div>
</template>

<style></style>
