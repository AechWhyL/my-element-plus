import type { Ref } from "vue";

// 消息类型
export type MessageType = "success" | "info" | "warning" | "error";

// 消息位置
export type MessagePosition = "top" | "center" | "bottom";

// 消息效果
export type MessageEffect = "dark" | "light";

// 简化分组配置
export interface MessageGroupConfig {
  enabled: boolean; // 是否启用分组功能
  groupByDuration?: number; // 分组时间窗口（毫秒），默认5000ms
  groupBy?: (messageInstance: MessageInstance) => any // 分组依据, 默认根据message内容分组，若返回了message实例id，返回值相同的归为一组
}

// 消息配置接口
export interface MessageConfig {
  type?: MessageType;
  message: string; // 统一的消息内容
  duration?: number;
  effect?: MessageEffect;
  icon?: string;
  customClass?: string;
  groupConfig?: MessageGroupConfig;
  onClose?: (instance: MessageInstance) => void;
}

export type MessageProps = MessageConfig & {
  index?: number;
  groupingCount?: number;
};

// 消息实例接口
export interface MessageInstance {
  id: string; // 内部自动生成
  config: MessageConfig;
  count?: number;
}

export interface MessageEmits {
  (e: "before-close"): void;
}

export interface MessageWrapperProps {
  gap?: number;
  groupConfig?: MessageGroupConfig; // 分组配置
  appendTo?: string;
  messageInstances: Ref<MessageInstance[]>;
}

export interface MessageWrapperCTX {
  messageInstances: Ref<MessageInstance[]>;
  gap: Ref<number>;
  messageRefs: Ref<HTMLElement[]>;
}

export interface MessageWrapperExpose {
  renderMessage: (params: MessageConfig) => void;
  closeMessage: (id: string) => void;
  clearMessage: () => void;
}
