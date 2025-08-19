import MessageWrapper from "./MessageWrapper.vue";
import { h, ref, render } from "vue";
import type { MessageConfig, MessageInstance } from "./type";
import { v4 as uuid } from "uuid";

const defaultConfig: MessageConfig = {
  type: "info",
  message: "",
};

const createMessage = () => {
  const messageInstances = ref<MessageInstance[]>([]);
  const renderMessage = (params: MessageConfig) => {
    const config = { ...defaultConfig, ...params };
    const newMessage: MessageInstance = {
      id: uuid(),
      config,
      count: 1,
    };
    const groupConfig = config.groupConfig;
    if (groupConfig?.enabled) { // 分组
      const groupByFunc =
        groupConfig.groupBy ||
        ((messageInstance: MessageInstance) => messageInstance.config.message);
      const groupBy = groupByFunc(newMessage);
      const group = messageInstances.value.find(
        (item) => groupByFunc(item) === groupBy
      );
      if (group) {
        group.count = group.count! + 1;
        group.config = { ...group.config, ...config };
      } else {
        newMessage.count = 1;
        messageInstances.value.push(newMessage);
      }
    } else { // 添加
      messageInstances.value.push(newMessage);
    }
    return newMessage;
  };
  const wrapper = h(MessageWrapper, { messageInstances });
  render(wrapper, document.body);

  const HMessage = (options: string | MessageConfig) => {
    let params: MessageConfig;
    if (typeof options === "string") {
      params = {
        message: options,
        type: "info",
      };
    } else {
      params = options;
    }
    return renderMessage(params);
  };
  HMessage.close = (id: string) => {
    messageInstances.value = messageInstances.value.filter(
      (item) => item.id !== id
    );
  };
  HMessage.clear = () => {
    messageInstances.value = [];
  };

  return HMessage;
};

const FunctionalMessage = createMessage();

export default FunctionalMessage;
