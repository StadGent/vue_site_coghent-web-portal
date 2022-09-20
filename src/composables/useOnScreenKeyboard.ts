import { ref } from 'vue'

type KeyboardState = 'shown' | 'hidden'

const keyboardState = ref({ state: 'hidden' })

export const keyboard = ref(undefined)

export const useOnScreenKeyboard = () => {
  const changeKeyboardState = (state: KeyboardState) => {
    keyboardState.value.state = state
  }

  const hideKeyboard = () => {
    if (keyboard.value) {
      //@ts-ignore
      keyboard.value.clearInput()
    }
    changeKeyboardState('hidden')
  }

  const showKeyboard = () => {
    changeKeyboardState('shown')
  }

  return { hideKeyboard, showKeyboard, keyboardState }
}
