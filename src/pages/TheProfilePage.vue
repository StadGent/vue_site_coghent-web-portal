<template>
  <section class="flex mt-16">
    <div class="bg-background-medium flex p-8 flex-col w-2/6">
      <div class="flex-col justify-between flex-1">
        <h2 class="mt-5 font-bold text-4xl">Hoi Bert!</h2>
        <p class="text-accent-yellow font-bold mt-10 text-lg">Account details</p>
        <p class="mt-8 text-lg">Mijn verhalen</p>
        <p class="mt-8 text-lg">Mijn werken</p>
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
        <input class="p-3 h-10 w-9/12 mr-5 bg-text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent" 
        placeholder="Gebruikersnaam" :disabled="!edit.username.value" />
        <base-button text="Wijzigen" @click="editField('username')" custom-style="ghost-black" :iconShown="true" customIcon="edit" />
      </div>
      <p class="mt-8 font-bold">Email adres</p>
      <div class="flex mt-4 items-center">
        <input class="p-3 h-10 w-9/12 mr-5 bg-text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent" 
        placeholder="Email" :disabled="!edit.email.value" />
        <base-button text="Wijzigen" @click="editField('email')" custom-style="ghost-black" :iconShown="true" customIcon="edit" />
      </div>
      <p class="mt-8 font-bold">Wachtwoord</p>
      <div class="flex mt-4 items-center">
        <input class="p-3 h-10 w-9/12 mr-5 bg-text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent" placeholder="Wachtwoord" :disabled="!edit.password.value" />
        <base-button text="Wijzigen" @click="editField('password')" custom-style="ghost-black" :iconShown="true" customIcon="edit" />
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
import { BaseButton } from 'coghent-vue-3-component-library'

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
  components: { BaseButton },
  setup() {
    const buttonClick = () => {
      console.log('click')
    }

    const editField = (field: String) => {
      //TODO Shorten this
      switch (field) {
        case 'username':
          if (edit.username.value === false) edit.username.value = !edit.username.value
          else {
            edit.username.value = !edit.username.value
            //TODO needs saving logic
          }
          break
        case 'email':
          if (edit.email.value === false) edit.email.value = !edit.email.value
          else {
            edit.email.value = !edit.email.value
            //TODO needs saving logic
          }
          break
        case 'password':
          if (edit.password.value === false) edit.password.value = !edit.password.value
          else {
            edit.password.value = !edit.password.value
            //TODO needs saving logic
          }
          break
      }
    }

    return {
      buttonClick,
      editField,
      edit,
      user,
    }
  },
})
</script>

<style scoped>
</style>