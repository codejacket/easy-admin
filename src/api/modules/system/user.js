import { crud } from '@/utils/crud'

export const { listUser, getUser, addUser, updateUser, delUser } = crud('/system/user', 'user')