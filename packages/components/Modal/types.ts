
import type { ExtractPropTypes, PropType } from 'vue'

export const modalProps = {
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  center: {
    type: Boolean,
    default: false,
  },
  closeOnClickModal: {
    type: Boolean,
    default: true,
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true,
  },
  lockScroll: {
    type: Boolean,
    default: true,
  },
} as const

export const modalEmits = {
  close: () => true,
  open: () => true,
  opened: () => true,
  closed: () => true,
  confirm: () => true,
  cancel: () => true,
}

export type ModalProps = ExtractPropTypes<typeof modalProps>
export type ModalEmits = typeof modalEmits
