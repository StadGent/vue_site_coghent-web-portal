<template>
  <div :class="`${keyboardClass}`" @mousedown="preventFocus"></div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import Keyboard from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'
import layout from 'simple-keyboard-layouts/build/layouts/french'
import { useOnScreenKeyboard, keyboard } from '../composables/useOnScreenKeyboard'

export default defineComponent({
  name: 'OnScreenKeyboard',
  props: {
    keyboardClass: {
      default: 'simple-keyboard',
      type: String,
    },
    input: {
      type: String,
    },
  },
  watch: {
    input(input) {
      keyboard.value.setInput(input)
    },
  },
  emits: ['onChange', 'onKeyPress'],
  setup: (props, { emit }) => {
    const { keyboardState } = useOnScreenKeyboard()

    const preventFocus = (event) => {
      event.preventDefault()
    }

    onMounted(() => {
      const onChange = (input) => {
        emit('onChange', input)
        const inputEvent = new CustomEvent('virtualKeyboardEvent', { detail: { input } })
        document.dispatchEvent(inputEvent)
      }

      const onKeyPress = (button) => {
        emit('onKeyPress', button)

        /**
         * If you want to handle the shift and caps lock buttons
         */
        if (button === '{shift}' || button === '{lock}') handleShift()

        const inputEvent = new CustomEvent('virtualKeyboardEvent', { detail: { input: button } })
        document.dispatchEvent(inputEvent)
      }

      const handleShift = () => {
        let currentLayout = keyboard.value.options.layoutName
        let shiftToggle = currentLayout === 'default' ? 'shift' : 'default'

        keyboard.value.setOptions({
          layoutName: shiftToggle,
        })
      }

      const keyboardObject = new Keyboard({
        onChange: onChange,
        onKeyPress: onKeyPress,
        excludeFromLayout: {
          default: ['@', '.com'],
        },
        ...layout,
      })
      keyboard.value = keyboardObject
      const inputEvent = new CustomEvent('virtualKeyboardEvent', { detail: { input: '' } })
      document.dispatchEvent(inputEvent)
    })

    return { keyboardState, preventFocus, keyboard }
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
