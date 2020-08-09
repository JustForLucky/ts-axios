import { ResolvedFn, RejectedFn} from '../types/index'


interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T>|null>

  constructor() {
    this.interceptors = []
  }

  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })
    return this.interceptors.length - 1
  }
  /** 内部方法，不定义在外部接口中 */
  forEach(fn: (interceptor: Interceptor<T>) => void) {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }

  eject(id: number): void {
    /** 不能通过删除的方式取消拦截器，因为id是数组的下标，删除会导致顺序错乱 */
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
}
