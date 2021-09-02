<template>
  <section class="flex mt-16">
    <div class="bg-background-medium flex p-8 flex-col w-2/6">
      <div class="flex-col justify-between flex-1">
        <h2 class="mt-5 font-bold text-4xl">Hoi Bert!</h2>
        <p class="text-accent-yellow font-bold mt-10 text-lg">Account details</p>
        <router-link to="/"><p class="mt-8 text-lg w-auto inline-block">Mijn verhalen</p></router-link>
        <br />
        <router-link to="/"><p class="mt-8 text-lg w-auto inline-block">Mijn werken</p></router-link>
      </div>
      <base-button text="Afmelden" :on-click="buttonClick" custom-style="ghost-black" :iconShown="true" customIcon="logout" />
    </div>
    <div class="flex-1 xl:ml-48 sm:ml-24 p-8">
      <p class="mt-5 font-bold">Profielfoto</p>
      <div class="flex mt-4">
        <img class="w-36 h-36 mr-4 bg-accent-yellow rounded-md" src="../assets/logo.png" />
        <base-button class="self-end" text="Verwijderen" :on-click="buttonClick" custom-style="ghost-black" :iconShown="true" customIcon="delete" />
      </div>
      <p class="mt-8 font-bold">Gebruikersnaam</p>
      <div class="flex mt-4 items-center">
        <base-input ref="usernameRef" placeholder="Gebruikersnaam" :disabled="!edit.username.value" />
        <base-button v-show="!edit.username.value" text="Wijzigen" @click="editField('username')" custom-style="ghost-black" :iconShown="true" customIcon="edit" />
      </div>
      <div class="flex gap-4 my-4" v-show="edit.username.value">
        <base-button text="Annuleren" @click="editField('username')" custom-style="secondary" :iconShown="false" />
        <base-button text="Opslaan" @click="saveEdit('username')" custom-style="primary" :iconShown="false" />
      </div>
      <p class="mt-8 font-bold">Email adres</p>
      <div class="flex mt-4 items-center">
        <base-input ref="emailRef" placeholder="Email" :disabled="!edit.email.value" />
        <base-button v-show="!edit.email.value" text="Wijzigen" @click="editField('email')" custom-style="ghost-black" :iconShown="true" customIcon="edit" />
      </div>
      <div class="flex gap-4 my-4" v-show="edit.email.value">
        <base-button text="Annuleren" @click="editField('email')" custom-style="secondary" :iconShown="false" />
        <base-button text="Opslaan" @click="saveEdit('email')" custom-style="primary" :iconShown="false" />
      </div>
      <p class="mt-8 font-bold">Wachtwoord</p>
      <div class="flex mt-4 items-center">
        <base-input :ref="passwordRef" placeholder="Wachtwoord" :disabled="!edit.password.value" />
        <base-button v-show="!edit.password.value" text="Wijzigen" @click="editField('password')" custom-style="ghost-black" :iconShown="true" customIcon="edit" />
      </div>
      <div class="flex gap-4 my-4" v-show="edit.password.value">
        <base-button text="Annuleren" @click="editField('password')" custom-style="secondary" :iconShown="false" />
        <base-button text="Opslaan" @click="saveEdit('password')" custom-style="primary" :iconShown="false" />
      </div>
      <p class="mt-8 font-bold">Delete account</p>
      <div class="flex mt-4 xl:space-x-44 sm:space-x-24 lg:space-x-44 items-center">
        <p class="xl:max-w-xs sm:max-w-md text-sm">Door je account te verwijderen gaan al je gegevens definitief verloren</p>
        <base-button text="Account verwijderen" :on-click="buttonClick" custom-style="ghost-red" :iconShown="true" customIcon="delete" />
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { BaseButton, BaseInput } from 'coghent-vue-3-component-library'

const usernameRef = ref<HTMLElement | null>(null)
const emailRef = ref<HTMLElement | null>(null)
const passwordRef = ref<HTMLElement | null>(null)

const input = {
  username: ref<String>(''),
  email: ref<String>(''),
  password: ref<String>(''),
}

const user = {
  username: ref<String>('Bert De Backer'),
  email: ref<String>('Bert_De_Backer@hotmail.com'),
  password: ref<String>('bertje123'),
}

const edit = {
  username: ref<Boolean>(false),
  email: ref<Boolean>(false),
  password: ref<Boolean>(false),
}

export default defineComponent({
  components: { BaseButton, BaseInput },
  setup() {
    //temp
    const buttonClick = () => {
      console.log('click')
    }

    const editField = (field: String) => {
      //TODO Shorten this
      switch (field) {
        case 'username':
          if (edit.username.value === false) {
            edit.username.value = !edit.username.value
            if (usernameRef.value) usernameRef.value.focus()
          } else {
            edit.username.value = !edit.username.value
          }
          break
        case 'email':
          if (edit.email.value === false) {
            edit.email.value = !edit.email.value
            //TODO Fix automatic focus on edit
          } else {
            edit.email.value = !edit.email.value
          }
          break
        case 'password':
          if (edit.password.value === false) {
            edit.password.value = !edit.password.value
            if (passwordRef.value) passwordRef.value.focus()
          } else {
            edit.password.value = !edit.password.value
          }
          break
      }
    }

    const saveEdit = (field: String) => {
      switch (field) {
        case 'username':
          break
        case 'email':
          break
        case 'password':
          break
      }
    }

    return {
      buttonClick,
      editField,
      edit,
      user,
      usernameRef,
      emailRef,
      passwordRef,
    }
  },
})
</script>

<style scoped>
</style>