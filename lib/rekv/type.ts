// TypeScript generics used to set an object deep readonly
import type { Rekv } from './index'
export type DeepReadonly<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends Function
  ? T
  : T extends object
  ? DeepReadonlyObject<T>
  : T;

export type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>;

export type SetStateParam = Partial<InitState> | ((s: InitState) => Partial<InitState>)

export type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

// MapEffects used to export Effects functions definition to
export type MapEffects<T> = {
  [P in keyof T]: T[P] extends (...args: infer U) => infer R ? (...args: U) => R : T;
};

export type SubscribeCallback<T> = (v: T) => void;

export interface InitState {
  [key: string]: any;
}

export type RekvOptions = {
  effects: Effect
}

export interface RekvDelegate<T, K> {
  beforeUpdate?: (e: { store: T; state: Readonly<K> }) => K | void;
  afterUpdate?: (e: { store: T; state: Readonly<K> }) => void;
}

export type Effect = {
  [key: string]: (
    this: Pick<Rekv<InitState, any>, 'currentState' | 'setState' | 'on' | 'off'>,
    ...args: any[]
  ) => void;
}
