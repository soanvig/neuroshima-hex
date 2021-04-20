export interface Component {
  mount: VoidFunction;
  unmount: VoidFunction;
  guard: () => boolean;
}
