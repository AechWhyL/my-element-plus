import { usePopper } from "../usePopper";
import { defineComponent, isRef, nextTick, ref, unref, type Ref } from "vue";
import { describe, test, expect, it, vi, afterEach, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import type { Options } from "@popperjs/core";

const mockReference = document.createElement("div");
const mockPopper = document.createElement("div");

document.body.appendChild(mockReference);
document.body.appendChild(mockPopper);

const referenceRef = ref<HTMLDivElement | null>(mockReference);
const popperRef = ref<HTMLDivElement | null>(mockPopper);
const optionsRef = ref<Partial<Options>>({})

const testComp = defineComponent({
  setup() {
    return usePopper(referenceRef as Ref<HTMLDivElement>, popperRef as Ref<HTMLDivElement>, optionsRef)
  },
  render() {
    return <div />;
  }
});

let wrapper: ReturnType<typeof mount>;

const mountTestComp = async () => {
  wrapper = mount(testComp);
  await nextTick()
}

const getVmProp = (propName: string) => {
  return (wrapper.vm as any)[propName]
}

describe("usePopper", async () => {

  beforeEach(async () => {
    referenceRef.value = mockReference
    popperRef.value = mockPopper
    await mountTestComp()
  })
  afterEach(() => {
    wrapper.unmount()
    referenceRef.value = null;
    popperRef.value = null;
    optionsRef.value = {};
  })

  it('should render well', async () => {
    await mountTestComp()
    expect(getVmProp('state')).toBeDefined()
  })

  it('should not render popper instance when elements have not changed', async () => {
    await mountTestComp()
    const preservedInstance = getVmProp('popperInstanceRef')

    await wrapper.setProps({})

    expect(preservedInstance).toStrictEqual(getVmProp('popperInstanceRef'))
  })

  it('should not render again when options change', async () => {
    await mountTestComp()
    const preservedInstance = getVmProp('popperInstanceRef')
    const setOptionsSpy = vi.spyOn(preservedInstance, "setOptions")

    optionsRef.value = {
      placement: 'top'
    }

    await nextTick()

    expect(setOptionsSpy).toHaveBeenCalled()

    expect(preservedInstance).toStrictEqual(getVmProp('popperInstanceRef'))
  })

  it('should render again when reference or popper change', async () => {
    await mountTestComp()
    const preservedInstance = getVmProp('popperInstanceRef')

    referenceRef.value = document.createElement('div')
    await nextTick()

    const newPreservedInstance = getVmProp('popperInstanceRef')
    expect(newPreservedInstance).not.toStrictEqual(preservedInstance)

    popperRef.value = document.createElement('div')
    await nextTick()

    const newPreservedInstance2 = getVmProp('popperInstanceRef')
    expect(newPreservedInstance2).not.toStrictEqual(newPreservedInstance)
  })

  it("should rerender when reference and popper are not both defined", async () => {
    referenceRef.value = null
    await mountTestComp()
    const preservedInstance = getVmProp('popperInstanceRef')
    expect(preservedInstance).not.toBeDefined()
  })

  it("should destory popper instance when component unmounted", async () => {
    const preservedInstance = getVmProp('popperInstanceRef')
    const spy = vi.spyOn(preservedInstance, "destroy")
    wrapper.unmount()
    await nextTick()
    expect(spy).toHaveBeenCalled()
  })

  test("with arrow", async () => {
    const arrow = document.createElement("span")
    popperRef.value?.appendChild(arrow)
    optionsRef.value = {
      modifiers: [
        {
          name: 'arrow',
          options: {
            element: arrow,
          },
          enabled: true
        }
      ]
    }
    await mountTestComp()
    const styles = getVmProp("styles")
    expect(styles.arrow).toBeDefined()
  })
});
