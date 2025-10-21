import { crud } from '@/utils/crud'

export const { listRole, getRole, addRole, updateRole, delRole } = crud('/system/role', 'role')
