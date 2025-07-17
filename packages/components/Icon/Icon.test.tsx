import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Icon from "./Icon.vue";
import type { IconProps } from "./types";

describe("Icon.vue", () => {
    it("should has the correct type class when type prop is set", () => {
        const types: IconProps["type"][] = ["primary", "success", "warning", "danger", "info"];
        types.forEach((type) => {
            const wrapper = mount(Icon, {
                props: { icon: "house", type: type },
            });
            expect(wrapper.classes()).toContain(`er-icon--${type}`);
        });
    })

    it("should has the correct customStyle computed when color prop is set", () => {
        const wrapper1 = mount(Icon, {
            props: { icon: "house", color: "red" },
        });
        expect((wrapper1.vm as any).customStyle.color).toBe("red");

        const wrapper2 = mount(Icon, {
            props: { icon: "house" },
        });
        expect((wrapper2.vm as any).customStyle.color).toBeUndefined();
    })

    it("should filter out the color and type props", () => {
        const wrapper = mount(Icon, {
            props: { icon: "house", color: "red", type: "primary" },
        });
        expect((wrapper.vm as any).filteredProps.color).toBeUndefined();
        expect((wrapper.vm as any).filteredProps.type).toBeUndefined();
    })
})