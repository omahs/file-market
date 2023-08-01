import { makeAutoObservable } from 'mobx'

export class DateStore {
  now: number
  constructor() {
    this.now = Date.now()
    setInterval(() => { this.setTime(Date.now()) }, 1000)
    makeAutoObservable(this)
  }

  setTime(time: number) {
    this.now = time
  }

  get nowTime() {
    return this.now
  }
}
