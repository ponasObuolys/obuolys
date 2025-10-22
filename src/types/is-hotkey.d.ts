declare module "is-hotkey" {
  type HotKey = string | string[];

  interface Options {
    byKey?: boolean;
  }

  type KeydownEvent = KeyboardEvent | { key: string; which?: number; keyCode?: number };

  interface IsHotKey {
    (hotkey: HotKey, event?: KeydownEvent, options?: Options): boolean;
    (hotkey: HotKey, options: Options): (event: KeydownEvent) => boolean;
  }

  const isHotKey: IsHotKey;
  export default isHotKey;
}
