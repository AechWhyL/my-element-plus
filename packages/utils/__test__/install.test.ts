import { describe, it, expect, vi } from "vitest";
import { makeIntaller, withInstall } from "../install";
import { createApp, type Plugin } from "vue";

// Mock simple Vue plugins for testing
const mockPlugin: Plugin = {
  install: vi.fn(),
};

const mockPlugin2: Plugin = {
  install: vi.fn(),
};

// Mock simple components for testing
const mockComponent = {
  name: "mockComponent1",
};

const mockUnnamedComponent = {};

const mockPluginWithName: Plugin = {
  install: vi.fn(),
  name: "MockPluginWithName",
};

describe("makeInstaller", () => {
  it("makeInstaller函数应该返回一个函数", () => {
    expect(typeof makeIntaller).toBe("function");
  });

  it("makeInstaller返回的函数执行时，应当将传入的所有plugin都调用一次use", () => {
    const plugins = [mockPlugin, mockPlugin2];
    const installer = makeIntaller(plugins);

    const app = createApp({});
    app.use(installer);

    expect(mockPlugin.install).toBeCalledTimes(1);
    expect(mockPlugin2.install).toBeCalledTimes(1);
  });
});

describe("withInstall", () => {
  it("withInstaller函数应该返回一个具有名为install的函数属性的对象", () => {
    const obj = withInstall(mockPlugin);
    expect(typeof obj.install).toBe("function");
  });

  it("withInstaller注入的install函数中应当将组件注册到Vue实例的components中", () => {
    const app = createApp({});
    const obj = withInstall(mockComponent);
    app.use(obj);
    expect(app.component(mockComponent.name)).toBe(mockComponent);
  });

  it("withInstaller注入的install函数应当处理未命名组件", () => {
    const app = createApp({});
    const obj = withInstall(mockUnnamedComponent);
    app.use(obj);
    expect(app.component("UnnamedComponent")).toBe(mockUnnamedComponent);
  });
});
