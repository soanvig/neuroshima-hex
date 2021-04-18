export const RxJS = {
  NotificationKind: rxjs.NotificationKind,
  operators: rxjs.operators,
  testing: rxjs.testing,
  ajax: rxjs.ajax,
  webSocket: rxjs.webSocket,
  fetch: rxjs.fetch,
  Observable: rxjs.Observable,
  ConnectableObservable: rxjs.ConnectableObservable,
  GroupedObservable: rxjs.GroupedObservable,
  observable: rxjs.observable,
  Subject: rxjs.Subject,
  BehaviorSubject: rxjs.BehaviorSubject,
  ReplaySubject: rxjs.ReplaySubject,
  AsyncSubject: rxjs.AsyncSubject,
  asap: rxjs.asap,
  asapScheduler: rxjs.asapScheduler,
  async: rxjs.async,
  asyncScheduler: rxjs.asyncScheduler,
  queue: rxjs.queue,
  queueScheduler: rxjs.queueScheduler,
  animationFrame: rxjs.animationFrame,
  animationFrameScheduler: rxjs.animationFrameScheduler,
  VirtualTimeScheduler: rxjs.VirtualTimeScheduler,
  VirtualAction: rxjs.VirtualAction,
  Scheduler: rxjs.Scheduler,
  Subscription: rxjs.Subscription,
  Subscriber: rxjs.Subscriber,
  Notification: rxjs.Notification,
  pipe: rxjs.pipe,
  noop: rxjs.noop,
  identity: rxjs.identity,
  isObservable: rxjs.isObservable,
  ArgumentOutOfRangeError: rxjs.ArgumentOutOfRangeError,
  EmptyError: rxjs.EmptyError,
  ObjectUnsubscribedError: rxjs.ObjectUnsubscribedError,
  UnsubscriptionError: rxjs.UnsubscriptionError,
  TimeoutError: rxjs.TimeoutError,
  bindCallback: rxjs.bindCallback,
  bindNodeCallback: rxjs.bindNodeCallback,
  combineLatest: rxjs.combineLatest,
  concat: rxjs.concat,
  defer: rxjs.defer,
  empty: rxjs.empty,
  forkJoin: rxjs.forkJoin,
  from: rxjs.from,
  fromEvent: rxjs.fromEvent,
  fromEventPattern: rxjs.fromEventPattern,
  generate: rxjs.generate,
  iif: rxjs.iif,
  interval: rxjs.interval,
  merge: rxjs.merge,
  never: rxjs.never,
  of: rxjs.of,
  onErrorResumeNext: rxjs.onErrorResumeNext,
  pairs: rxjs.pairs,
  partition: rxjs.partition,
  race: rxjs.race,
  range: rxjs.range,
  throwError: rxjs.throwError,
  timer: rxjs.timer,
  using: rxjs.using,
  zip: rxjs.zip,
  scheduled: rxjs.scheduled,
  EMPTY: rxjs.EMPTY,
  NEVER: rxjs.NEVER,
  config: rxjs.config,
};

export const audit = rxjs.operators.audit;
export const auditTime = rxjs.operators.auditTime;
export const buffer = rxjs.operators.buffer;
export const bufferCount = rxjs.operators.bufferCount;
export const bufferTime = rxjs.operators.bufferTime;
export const bufferToggle = rxjs.operators.bufferToggle;
export const bufferWhen = rxjs.operators.bufferWhen;
export const catchError = rxjs.operators.catchError;
export const combineAll = rxjs.operators.combineAll;
export const combineLatest = rxjs.operators.combineLatest;
export const concat = rxjs.operators.concat;
export const concatAll = rxjs.operators.concatAll;
export const concatMap = rxjs.operators.concatMap;
export const concatMapTo = rxjs.operators.concatMapTo;
export const count = rxjs.operators.count;
export const debounce = rxjs.operators.debounce;
export const debounceTime = rxjs.operators.debounceTime;
export const defaultIfEmpty = rxjs.operators.defaultIfEmpty;
export const delay = rxjs.operators.delay;
export const delayWhen = rxjs.operators.delayWhen;
export const dematerialize = rxjs.operators.dematerialize;
export const distinct = rxjs.operators.distinct;
export const distinctUntilChanged = rxjs.operators.distinctUntilChanged;
export const distinctUntilKeyChanged = rxjs.operators.distinctUntilKeyChanged;
export const elementAt = rxjs.operators.elementAt;
export const endWith = rxjs.operators.endWith;
export const every = rxjs.operators.every;
export const exhaust = rxjs.operators.exhaust;
export const exhaustMap = rxjs.operators.exhaustMap;
export const expand = rxjs.operators.expand;
export const filter = rxjs.operators.filter;
export const finalize = rxjs.operators.finalize;
export const find = rxjs.operators.find;
export const findIndex = rxjs.operators.findIndex;
export const first = rxjs.operators.first;
export const groupBy = rxjs.operators.groupBy;
export const ignoreElements = rxjs.operators.ignoreElements;
export const isEmpty = rxjs.operators.isEmpty;
export const last = rxjs.operators.last;
export const map = rxjs.operators.map;
export const mapTo = rxjs.operators.mapTo;
export const materialize = rxjs.operators.materialize;
export const max = rxjs.operators.max;
export const merge = rxjs.operators.merge;
export const mergeAll = rxjs.operators.mergeAll;
export const mergeMap = rxjs.operators.mergeMap;
export const flatMap = rxjs.operators.flatMap;
export const mergeMapTo = rxjs.operators.mergeMapTo;
export const mergeScan = rxjs.operators.mergeScan;
export const min = rxjs.operators.min;
export const multicast = rxjs.operators.multicast;
export const observeOn = rxjs.operators.observeOn;
export const onErrorResumeNext = rxjs.operators.onErrorResumeNext;
export const pairwise = rxjs.operators.pairwise;
export const partition = rxjs.operators.partition;
export const pluck = rxjs.operators.pluck;
export const publish = rxjs.operators.publish;
export const publishBehavior = rxjs.operators.publishBehavior;
export const publishLast = rxjs.operators.publishLast;
export const publishReplay = rxjs.operators.publishReplay;
export const race = rxjs.operators.race;
export const reduce = rxjs.operators.reduce;
export const repeat = rxjs.operators.repeat;
export const repeatWhen = rxjs.operators.repeatWhen;
export const retry = rxjs.operators.retry;
export const retryWhen = rxjs.operators.retryWhen;
export const refCount = rxjs.operators.refCount;
export const sample = rxjs.operators.sample;
export const sampleTime = rxjs.operators.sampleTime;
export const scan = rxjs.operators.scan;
export const sequenceEqual = rxjs.operators.sequenceEqual;
export const share = rxjs.operators.share;
export const shareReplay = rxjs.operators.shareReplay;
export const single = rxjs.operators.single;
export const skip = rxjs.operators.skip;
export const skipLast = rxjs.operators.skipLast;
export const skipUntil = rxjs.operators.skipUntil;
export const skipWhile = rxjs.operators.skipWhile;
export const startWith = rxjs.operators.startWith;
export const subscribeOn = rxjs.operators.subscribeOn;
export const switchAll = rxjs.operators.switchAll;
export const switchMap = rxjs.operators.switchMap;
export const switchMapTo = rxjs.operators.switchMapTo;
export const take = rxjs.operators.take;
export const takeLast = rxjs.operators.takeLast;
export const takeUntil = rxjs.operators.takeUntil;
export const takeWhile = rxjs.operators.takeWhile;
export const tap = rxjs.operators.tap;
export const throttle = rxjs.operators.throttle;
export const throttleTime = rxjs.operators.throttleTime;
export const throwIfEmpty = rxjs.operators.throwIfEmpty;
export const timeInterval = rxjs.operators.timeInterval;
export const timeout = rxjs.operators.timeout;
export const timeoutWith = rxjs.operators.timeoutWith;
export const timestamp = rxjs.operators.timestamp;
export const toArray = rxjs.operators.toArray;
export const window = rxjs.operators.window;
export const windowCount = rxjs.operators.windowCount;
export const windowTime = rxjs.operators.windowTime;
export const windowToggle = rxjs.operators.windowToggle;
export const windowWhen = rxjs.operators.windowWhen;
export const withLatestFrom = rxjs.operators.withLatestFrom;
export const zip = rxjs.operators.zip;
export const zipAll = rxjs.operators.zipAll;

/**
 * Allows to await promise, but bypasses arguments just like normal `tap`
 */
export const asyncTap = (cbReturningPromise) => switchMap(v => {
  return RxJS.from(cbReturningPromise(v)).pipe(
    mapTo(v),
  );
});
