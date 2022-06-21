<template>
  <section class="flex flex-col md:flex-row md:mt-16">
    <profile-side-menu />
    <div v-if="user != null" class="flex-1 xl:ml-48 sm:ml-24 p-8">
      <p class="mt-5 font-bold">
        {{ t('profile.picture') }}
      </p>
      <div class="flex mt-4">
        <img class="w-36 h-36 mr-4 bg-accent-yellow rounded-md" src="../assets/logo.png" />
        <!-- <base-button class="self-end" text="Verwijderen" :on-click="buttonClick" custom-style="ghost-black" :iconShown="true" customIcon="delete" /> -->
      </div>

      <div class="flex mt-4">
        <a :href="getEditPage()" target="_blank">
          <base-button :text="t('profile.edit')" :on-click="buttonClick" custom-style="primary" :icon-shown="false" class="px-2 mb-2" />
        </a>
      </div>

      <p class="mt-8 font-bold">
        {{ t('profile.username') }}
      </p>
      <div class="flex mt-4 items-center">
        <base-input :ref="user.preferred_username" :model-value="user.preferred_username" :placeholder="t('profile.username')" :disabled="!user.preferred_username" />
        <!-- <base-button v-show="!edit.username.value" text="Wijzigen" @click="editField('username')" custom-style="ghost-black" :iconShown="true" customIcon="edit" /> -->
      </div>
      <!-- <div class="flex gap-4 my-4" v-show="edit.username.value">
        <base-button text="Annuleren" @click="editField('username')" custom-style="secondary" :iconShown="false" />
        <base-button text="Opslaan" @click="saveEdit('username')" custom-style="primary" :iconShown="false" />
      </div> -->
      <p class="mt-8 font-bold">
        {{ t('profile.email') }}
      </p>
      <div class="flex mt-4 items-center">
        <base-input :ref="user.email" :model-value="user.email" placeholder="Email" :disabled="!user.email" />
        <!-- <base-button v-show="!edit.email.value" text="Wijzigen" @click="editField('email')" custom-style="ghost-black" :iconShown="true" customIcon="edit" /> -->
      </div>
      <!-- <div class="flex gap-4 my-4" v-show="edit.email.value">
        <base-button text="Annuleren" @click="editField('email')" custom-style="secondary" :iconShown="false" />
        <base-button text="Opslaan" @click="saveEdit('email')" custom-style="primary" :iconShown="false" />
      </div> -->
      <!-- <p class="mt-8 font-bold">{{t('profile.password')}}</p>
      <div class="flex mt-4 items-center">
        <base-input :ref="passwordRef" placeholder="Wachtwoord" :disabled="!edit.password.value" />
        <base-button v-show="!edit.password.value" text="Wijzigen" @click="editField('password')" custom-style="ghost-black" :iconShown="true" customIcon="edit" />
      </div> -->
      <!-- <div class="flex gap-4 my-4" v-show="edit.password.value">
        <base-button text="Annuleren" @click="editField('password')" custom-style="secondary" :iconShown="false" />
        <base-button text="Opslaan" @click="saveEdit('password')" custom-style="primary" :iconShown="false" />
      </div> -->

      <p class="invisible mt-8 font-bold">
        {{ t('profile.delete') }}
      </p>
      <div class="invisible flex mt-4 xl:space-x-44 sm:space-x-24 lg:space-x-44 items-center">
        <p class="invisible xl:max-w-xs sm:max-w-md text-sm">
          {{ t('profile.delete-info') }}
        </p>
        <base-button :text="t('profile.delete-button')" :on-click="buttonClick" custom-style="invisible ghost-red" :icon-shown="true" custom-icon="delete" />
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { BaseButton, BaseInput } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'
import { User } from 'coghent-vue-3-component-library'
import { UserStore } from '../stores/UserStore'
import { ConfigStore } from '../stores/ConfigStore'
import StoreFactory from '../stores/StoreFactory'
import ProfileSideMenu from '../components/ProfileSideMenu.vue'
import { useSessionAuth } from '@/app'

export default defineComponent({
  components: { BaseButton, BaseInput, ProfileSideMenu },
  setup() {
    const router = useRouter()
    const userStore = StoreFactory.get(UserStore)
    const user: typeof User = userStore.user
    const configStore = StoreFactory.get(ConfigStore)
    const userEditUrl = configStore.config.value.userEditUrl

    //temp
    const buttonClick = () => {}

    const getEditPage = () => {
      if (userStore.hasUser) {
        const editRoute = userEditUrl + userStore.user.value.id
        return editRoute
      } else return
    }

    const logout = async () => {
      console.log(`STEP 1 | WEB LOGOUT `)
      fetch('/api/logout')
        .then(async (response) => {
          userStore.setUser(null)
          useSessionAuth.resetAuthProperties()
          router.push('/')
        })
        .catch((error) => {
          router.push('/')
          console.log(`WEB | Couldn't logout`, { error })
        })
    }

    const { t } = useI18n()

    return {
      buttonClick,
      userStore,
      user,
      getEditPage,
      t,
      logout,
    }
  },
})
</script>

<style scoped></style>
