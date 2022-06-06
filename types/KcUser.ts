export type KcUser = {
  username: string,
  userUid: string,
  isDisabled: boolean,
  externalReference: string,
  updatedAt: string,
  createdAt: string,
  roles: string[]
}

export type KcDataGridUserRow = {
  id: string,
  row: KcUser
}