import { ref } from 'vue'
import { User } from 'coghent-vue-3-component-library'
import BaseStore from './BaseStore'

export class UserStore extends BaseStore {
  id = 'UserStore'

  loading: boolean = false

  user = ref<typeof User | null>(null)

  get hasUser(): boolean {
    return this.user.value != null
  }

  setUser(user: typeof User | null): void {
    this.user.value = user
    this.loading = false
    console.log('the set user', this.user)
  }

  /*initUser(): Promise<void> {
        this.loading = true
        return RepositoryFactory.get(AuthRepository)
        .me()
        .then((currentUser) => {
            this.setUser(currentUser)
        })
    }*/
}
