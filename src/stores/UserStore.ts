import { ref } from 'vue'
import { User } from 'coghent-vue-3-component-library'
import BaseStore from './BaseStore'

export class UserStore extends BaseStore {
  id = 'UserStore'

  loading: boolean = false

  user = ref<typeof User>({} as typeof User)

  get hasUser(): boolean {
    return !!this.user.value.id
  }

  setUser(user: typeof User): void {
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
