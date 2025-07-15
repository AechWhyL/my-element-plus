import type { FontAwesomeIconProps } from "@fortawesome/vue-fontawesome";

export type IconProps = FontAwesomeIconProps & {
  /** 自行添加的 */
  type?: "primary" | "success" | "warning" | "danger" | "info";
  color?: string;
};
