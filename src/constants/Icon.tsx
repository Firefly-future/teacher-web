import {
  CrownOutlined,
  FileUnknownOutlined,
  FormOutlined,
  SnippetsOutlined,
  TeamOutlined,
} from '@ant-design/icons'

export const IconEnum = {
  'file-text': FormOutlined,
  form: FileUnknownOutlined,
  setting: CrownOutlined,
  database: SnippetsOutlined,
  team: TeamOutlined,
} as const

export type IconEnumKeys = keyof typeof IconEnum
