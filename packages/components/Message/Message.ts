import MessageWrapper from "./MessageWrapper.vue";
import { h, ref, render } from "vue";
import type { MessageConfig, MessageInstance } from "./type";
import { v4 as uuid } from "uuid";

const createMessage = () => {
  const messageInstances = ref<MessageInstance[]>([]);
  const renderMessage = (params: MessageConfig) => {
    const newMessage = {
      id: uuid(),
      config: params,
    };
    messageInstances.value.push(newMessage);
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
