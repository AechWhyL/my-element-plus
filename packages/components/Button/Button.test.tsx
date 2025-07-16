import { describe, it, expect, vi, test } from "vitest";
import { mount } from "@vue/test-utils";

import Button from "./Button.vue";
import Icon from "../Icon/Icon.vue";
import ButtonGroup from "./ButtonGroup.vue";

describe("Button.vue", () => {
  // Props: type
  it("should has the correct type class when type prop is set", () => {
    const types = ["primary", "success", "warning", "danger", "info"];
    types.forEach((type) => {
      const wrapper = mount(Button, {
        props: { type: type as any },
      });
      expect(wrapper.classes()).toContain(`er-button--${type}`);
    });
  });

  // Props: size
  it("should has the correct size class when size prop is set", () => {
    const sizes = ["large", "default", "small"];
    sizes.forEach((size) => {
      const wrapper = mount(Button, {
        props: { size: size as any },
      });
      expect(wrapper.classes()).toContain(`er-button--${size}`);
    });
  });

  // Props: plain, round, circle
  it.each([
    ["plain", "is-plain"],
    ["round", "is-round"],
    ["circle", "is-circle"],
    ["disabled", "is-disabled"],
    ["loading", "is-loading"],
  ])(
    "should has the correct class when prop %s is set to true",
    (prop, className) => {
      const wrapper = mount(Button, {
        props: { [prop]: true },
        global: {
          stubs: ["ErIcon"],
        },
      });
      expect(wrapper.classes()).toContain(className);
    }
  );

  it("should has the correct native type attribute when native-type prop is set", () => {
    const wrapper = mount(Button, {
      props: { nativeType: "submit" },
    });
    expect(wrapper.element.tagName).toBe("BUTTON");
    expect((wrapper.element as any).type).toBe("submit");
  });

  // Props: tag
  it("should renders the custom tag when tag prop is set", () => {
    const wrapper = mount(Button, {
      props: { tag: "a" },
    });
    expect(wrapper.element.tagName.toLowerCase()).toBe("a");
  });

  // Events: click
  it("should emits a click event when the button is clicked", async () => {
    const wrapper = mount(Button, {});
    await wrapper.trigger("click");
    expect(wrapper.emitted().click).toHaveLength(1);
  });

  // icon button
  test("icon button", async () => {
    const wrapper = mount(Button, {
      props: {
        icon: "house",
      },
      slots: {
        default: "icon button",
      },
      global: {
        stubs: ["ErIcon"],
      },
    });

    const iconElement = wrapper.findComponent(Icon);
    expect(iconElement.exists()).toBeTruthy();
    expect(iconElement.attributes("icon")).toBe("house");
  });

  // Test click throttle
  it.each([
    ["withoutThrottle", false],
    ["withThrottle", true],
  ])(
    "should emits a click event when the button is clicked %s",
    async (_, withThrottle) => {
      const clickSpy = vi.fn();
      const warpper = mount(() => (
        <Button
          onClick={clickSpy}
          useThrottle={withThrottle}
          throttleDuration={500}
        ></Button>
      ));
      await warpper.get("button").trigger("click");
      await warpper.get("button").trigger("click");
      await warpper.get("button").trigger("click");
      expect(clickSpy).toBeCalledTimes(withThrottle ? 1 : 3);
    }
  );

  // Test loading status
  it("should display loading icon and not emit click event when button is loading", async () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
      global: {
        stubs: ["ErIcon"],
      },
    });
    const iconElement = wrapper.findComponent(Icon);
    expect(wrapper.attributes("disabled")).toBeDefined()
    expect(wrapper.find(".er-loading-icon").exists()).toBeTruthy();
    expect(wrapper.find(".er-loading-icon").attributes("icon")).toBe("spinner");
    expect(iconElement.exists()).toBeTruthy();
    await wrapper.trigger("click");
    expect(wrapper.emitted().click).toBeUndefined();
  });
});

describe("ButtonGroup.vue", () => {
  // Button group
  it("should render the buttons in group", async () => {
    const wrapper = mount(() => (
      <ButtonGroup>
        <Button>button 1</Button>
        <Button>button 2</Button>
      </ButtonGroup>
    ));

    expect(wrapper.classes()).toContain("er-button-group");
    const buttonWrappers = wrapper.findAllComponents(Button);
    expect(buttonWrappers.length).toBe(2);
    expect(buttonWrappers[0].text()).toBe("button 1");
    expect(buttonWrappers[1].text()).toBe("button 2");
  });

  // button group size prop
  it("should has the correct size class when size prop is set", async () => {
    const sizes = ["large", "default", "small"];
    sizes.forEach((size) => {
      const wrapper = mount(() => (
        <ButtonGroup size={size}>
          <Button>button 1</Button>
          <Button>button 2</Button>
        </ButtonGroup>
      ));

      const buttonWrappers = wrapper.findAllComponents(Button);
      buttonWrappers.forEach((buttonWrapper) => {
        expect(buttonWrapper.classes()).toContain(`er-button--${size}`);
      });
    });
  });

  // button group type prop
  it("should has the correct type class when type prop is set", async () => {
    const types = ["primary", "success", "warning", "danger", "info"];
    types.forEach((type) => {
      const wrapper = mount(() => (
        <ButtonGroup type={type}>
          <Button>button 1</Button>
          <Button>button 2</Button>
        </ButtonGroup>
      ));

      const buttonWrappers = wrapper.findAllComponents(Button);
      buttonWrappers.forEach((buttonWrapper) => {
        expect(buttonWrapper.classes()).toContain(`er-button--${type}`);
      });
    });
  });

  // button group disabled prop
  it("should has the correct disabled class when disabled prop is set", async () => {
    const wrapper = mount(() => (
      <ButtonGroup disabled>
        <Button>button 1</Button>
        <Button>button 2</Button>
      </ButtonGroup>
    ));

    const buttonWrappers = wrapper.findAllComponents(Button);
    buttonWrappers.forEach((buttonWrapper) => {
      expect(buttonWrapper.attributes("disabled")).toBeDefined();
      expect(buttonWrapper.classes()).toContain("is-disabled");
    });
  });
});
