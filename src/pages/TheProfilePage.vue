<template>
  <section v-if="userStore.hasUser" class="flex mt-16">
    <div class="bg-background-medium flex p-8 flex-col w-2/6">
      <div class="flex-col justify-between flex-1">
        <h2 class="mt-5 font-bold text-4xl">Hey {{ user.preferred_username }}!</h2>
        <p class="text-accent-yellow font-bold mt-10 text-lg">
          {{ t('profile.details') }}
        </p>
        <router-link to="/">
          <p class="mt-8 text-lg w-auto inline-block">
            {{ t('profile.stories') }}
          </p>
        </router-link>
        <br />
        <router-link to="/">
          <p class="mt-8 text-lg w-auto inline-block">
            {{ t('profile.works') }}
          </p>
        </router-link>
      </div>
      <base-button :text="t('profile.logout')" :on-click="buttonClick" custom-style="ghost-black" :icon-shown="true" custom-icon="logout" />
    </div>
    <div class="flex-1 xl:ml-48 sm:ml-24 p-8">
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

      <p class="mt-8 font-bold">
        {{ t('profile.delete') }}
      </p>
      <div class="flex mt-4 xl:space-x-44 sm:space-x-24 lg:space-x-44 items-center">
        <p class="xl:max-w-xs sm:max-w-md text-sm">
          {{ t('profile.delete-info') }}
        </p>
        <base-button :text="t('profile.delete-button')" :on-click="buttonClick" custom-style="ghost-red" :icon-shown="true" custom-icon="delete" />
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { BaseButton, BaseInput } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'
import { GetMeDocument, User } from 'coghent-vue-3-component-library'
import { UserStore } from '../stores/UserStore'
import { ConfigStore } from '../stores/ConfigStore'
import StoreFactory from '../stores/StoreFactory'

export default defineComponent({
  components: { BaseButton, BaseInput },
  setup() {
    const router = useRouter()
    const userStore = StoreFactory.get(UserStore)
    const user: User = userStore.user
    const configStore = StoreFactory.get(ConfigStore)

    //temp
    const buttonClick = () => {
      console.log('click')
    }

    const getEditPage = () => {
      const editRoute = configStore.config.value.oidc.userEditUrl + userStore.user.value.id
      return editRoute
    }

    const { t } = useI18n()

    return {
      buttonClick,
      userStore,
      user,
      getEditPage,
      t,
    }
  },
})
</script>

<style scoped></style>
