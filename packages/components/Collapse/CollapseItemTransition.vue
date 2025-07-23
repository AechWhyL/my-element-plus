<script setup lang="ts">
const _setHeightZero = (el: HTMLElement) => (el.style.height = "0px");
const _setHeightScroll = (el: HTMLElement) =>
  (el.style.height = `${el.scrollHeight}px`);
const _setHeightEmpty = (el: HTMLElement) => (el.style.height = "");
const _setOverflowHidden = (el: HTMLElement) => (el.style.overflow = "hidden");
const _setOverflowEmpty = (el: HTMLElement) => (el.style.overflow = "");

const beforeEnter = (el: Element) => {
  _setHeightZero(el as HTMLElement);
  _setOverflowHidden(el as HTMLElement);
};
const afterEnter = (el: Element) => {
  _setHeightEmpty(el as HTMLElement);
  _setOverflowEmpty(el as HTMLElement);
};
const enter = (el: Element) => _setHeightScroll(el as HTMLElement);
const beforeLeave = (el: Element) => {
  _setHeightScroll(el as HTMLElement);
  _setOverflowHidden(el as HTMLElement);
};
const leave = (el: Element) => _setHeightZero(el as HTMLElement);
const afterLeave = (el: Element) => {
  _setHeightEmpty(el as HTMLElement);
  _setOverflowEmpty(el as HTMLElement);
};
</script>

<template>
  <Transition
    name="er-collapse-item-slide"
    @before-enter="beforeEnter"
    @after-enter="afterEnter"
    @enter="enter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot></slot>
  </Transition>
</template>

<style>
.er-collapse-item-slide-enter-active,
.er-collapse-item-slide-leave-active {
  transition: height var(--er-transition-duration) ease-in-out;
}
</style>
