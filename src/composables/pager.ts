export class Pager {
  limit: number
  skip: number
  count: number
  currentPage: number
  pageAmount: number

  constructor(limit: number, count: number = 0) {
    this.limit = limit
    this.skip = 0
    this.count = count
    this.currentPage = 1
    this.pageAmount = this.calculatePageAmount()
  }

  goToNextPage = (): number => {
    if (this.currentPage < this.pageAmount) {
      this.currentPage++
    } else {
      this.currentPage = 1
    }
    this.skip = this.currentPage * this.limit
    return this.currentPage
  }

  goToPreviousPage = (): number => {
    if (this.currentPage === 1) {
      this.currentPage = this.pageAmount
    } else {
      this.currentPage--
    }
    this.skip = this.currentPage * this.limit
    return this.currentPage
  }

  updateCount = (newCount: number): number => {
    this.currentPage = 1
    this.count = newCount
    this.calculatePageAmount()
    return this.count
  }

  calculatePageAmount = (): number => {
    if (this.count !== 0) {
      this.pageAmount = Math.floor(this.count / this.limit)
    } else {
      this.pageAmount = 1
    }
    return this.pageAmount
  }
}
