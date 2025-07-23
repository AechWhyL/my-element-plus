---
outline: deep
---

# Runtime API Examples

This page demonstrates usage of some of the runtime APIs provided by VitePress.

The main `useData()` API can be used to access site, theme, and page data for the current page. It works in both `.md` and `.vue` files:

```md
<script setup>
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
</script>

## Results

### Theme Data
<pre>{{ theme }}</pre>

### Page Data
<pre>{{ page }}</pre>

### Page Frontmatter
<pre>{{ frontmatter }}</pre>
```

<script setup>
import { useData } from 'vitepress'

const { site, theme, page, frontmatter } = useData()
</script>

## Results

### Theme Data
<pre>{{ theme }}</pre>

### Page Data
<pre>{{ page }}</pre>

### Page Frontmatter
<pre>{{ frontmatter }}</pre>

## More

Check out the documentation for the [full list of runtime APIs](https://vitepress.dev/reference/runtime-api#usedata).

## Component: Alert

### Basic Usage

Show basic alert messages.

:::details Code
```vue
<template>
  <div class="alert-demo">
    <HAlert title="Success alert" type="success" />
    <HAlert title="Info alert" type="info" />
    <HAlert title="Warning alert" type="warning" />
    <HAlert title="Error alert" type="error" />
  </div>
</template>
<style scoped>
.alert-demo > * {
  margin-bottom: 10px;
}
</style>
```
:::

### Theme

Alert component provides two different themes, `light` and `dark`.

:::details Code
```vue
<template>
  <div class="alert-demo">
    <HAlert title="Success alert" type="success" effect="dark" />
    <HAlert title="Info alert" type="info" effect="dark" />
    <HAlert title="Warning alert" type="warning" effect="dark" />
    <HAlert title="Error alert" type="error" effect="dark" />
  </div>
</template>
<style scoped>
.alert-demo > * {
  margin-bottom: 10px;
}
</style>
```
:::

### With Icon and Description

You can add a description and an icon to the alert.

:::details Code
```vue
<template>
  <div class="alert-demo">
    <HAlert 
      title="With Description" 
      description="This is a detailed description."
      type="success"
      showIcon 
    />
  </div>
</template>
```
:::

### Centered Text

Use the `center` attribute to center the text.

:::details Code
```vue
<template>
  <div class="alert-demo">
    <HAlert 
      title="Centered Text" 
      description="The content is centered."
      type="info"
      center
      showIcon 
    />
  </div>
</template>
```
:::

### Custom Close Text

You can customize the close button text.

:::details Code
```vue
<template>
  <div class="alert-demo">
    <HAlert 
      title="Custom Close Text" 
      type="warning"
      closeText="Got it"
    />
  </div>
</template>
```
:::
