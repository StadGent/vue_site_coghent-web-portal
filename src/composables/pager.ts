import { Ref, ref } from 'vue'

export class Pager {
  limit: Ref<number>
  skip: Ref<number>
  count: Ref<number>
  currentPage: Ref<number>
  pageAmount: Ref<number>

  constructor(limit: number, count: number = 0) {
    this.limit = ref(limit)
    this.skip = ref(0)
    this.count = ref(count)
    this.currentPage = ref(1)
    this.pageAmount = ref(this.calculatePageAmount())
  }

  goToNextPage = (callback: Function): number => {
    if (this.currentPage.value < this.pageAmount.value) {
      this.currentPage.value++
      this.skip.value = (this.currentPage.value - 1) * this.limit.value
    } else {
      this.currentPage.value = 1
      this.skip.value = 0
    }
    callback()
    return this.currentPage.value
  }

  goToPreviousPage = (callback: Function): number => {
    if (this.currentPage.value === 1) {
      this.currentPage.value = this.pageAmount.value
      this.skip.value = (this.pageAmount.value - 1) * this.limit.value
    } else {
      this.currentPage.value--
      this.skip.value = (this.currentPage.value - 1) * this.limit.value
    }
    callback()
    return this.currentPage.value
  }

  updateCount = (newCount: number): number => {
    if (newCount !== this.count.value) {
      this.currentPage.value = 1
      this.count.value = newCount
      this.pageAmount.value = this.calculatePageAmount()
    }
    return this.count.value
  }

  calculatePageAmount = (): number => {
    let amount = 0
    if (this.count.value !== 0) {
      amount = Math.ceil(this.count.value / this.limit.value)
    } else {
      amount = 1
    }
    return amount
  }
}
