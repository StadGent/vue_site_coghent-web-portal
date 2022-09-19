import { ref } from 'vue'

type KeyboardState = 'shown' | 'hidden'

const keyboardState = ref({ state: 'hidden', input: '' })

export const useOnScreenKeyboard = () => {
  const changeKeyboardState = (state: KeyboardState) => {
    keyboardState.value.state = state
  }

  const hideKeyboard = () => {
    changeKeyboardState('hidden')
  }

  const showKeyboard = () => {
    changeKeyboardState('shown')
  }

  return { hideKeyboard, showKeyboard, keyboardState }
}
