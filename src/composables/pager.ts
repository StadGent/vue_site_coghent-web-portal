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

  goToNextPage = (): number => {
    if (this.currentPage.value < this.pageAmount.value) {
      this.currentPage.value++
    } else {
      this.currentPage.value = 1
    }
    this.skip.value = this.currentPage.value * this.limit.value
    console.log(this.currentPage.value)
    return this.currentPage.value
  }

  goToPreviousPage = (): number => {
    if (this.currentPage.value === 1) {
      this.currentPage.value = this.pageAmount.value
    } else {
      this.currentPage.value--
    }
    this.skip.value = this.currentPage.value * this.limit.value
    console.log(this.currentPage)
    return this.currentPage.value
  }

  updateCount = (newCount: number): number => {
    this.currentPage.value = 1
    this.count.value = newCount
    this.pageAmount.value = this.calculatePageAmount()
    return this.count.value
  }

  calculatePageAmount = (): number => {
    let amount = 0
    if (this.count.value !== 0) {
      amount = Math.floor(this.count.value / this.limit.value)
    } else {
      amount = 1
    }
    return amount
  }
}
