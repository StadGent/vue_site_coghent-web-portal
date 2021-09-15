import { ref } from 'vue'
import { User } from 'coghent-vue-3-component-library'
import BaseStore from './BaseStore'

export class UserStore extends BaseStore {
    id = 'UserStore'

    loading: boolean = false

    user = ref<any>({
        id: '',
        email: '', 
        family_name: '',
        given_name: '', 
        name: '',
        preferred_username: ''
    })

    get hasUser(): boolean {
        return !!this.user.value.id
    }

    setUser(user: User): void {
        this.user.value = user
        this.loading = false
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