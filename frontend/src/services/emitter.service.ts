import EventEmitter from 'eventemitter3';

type IEvent = string | symbol;
type IFn = (...args: any[]) => void;

const eventEmitter = new EventEmitter();

const Emitter = {
  on: (event: IEvent, fn: IFn) => eventEmitter.on(event, fn),
  once: (event: IEvent, fn: IFn) => eventEmitter.once(event, fn),
  off: (event: IEvent, fn?: IFn) => eventEmitter.off(event, fn),
  emit: (event: IEvent, payload?: any[]) => eventEmitter.emit(event, payload)
};

Object.freeze(Emitter);

export default Emitter;
