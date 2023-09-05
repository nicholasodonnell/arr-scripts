export type Permissions = {
  chmod: string | undefined
  chown: {
    uid?: number | undefined
    gid?: number | undefined
  }
}
