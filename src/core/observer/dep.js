/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'
import config from '../config'

let uid = 0

/**
 * 依赖管理器Dep类
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 * 一个dep是一个可观察对象，可以有多个指令来订阅它。
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  // 删除一个依赖
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  // 添加一个依赖
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  // 通知所有依赖更新
  notify () {
    // stabilize the subscriber list first
    // 先稳定用户列表
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      // Subs不排序在调度程序，如果不运行异步，我们需要排序，以确保他们在正确的顺序启动
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// The current target watcher being evaluated.
// 正在评估的当前目标观察者。
// This is globally unique because only one watcher
// can be evaluated at a time.
// 这是全局唯一的，因为一次只能计算一个监视程序。
Dep.target = null
const targetStack = []

export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
