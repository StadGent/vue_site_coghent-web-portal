import { ref } from 'vue'

type OnBoardingState = {
  onboardingShown: Boolean
}

export const onboardingState = ref<OnBoardingState>({
  onboardingShown: false,
})

export const useOnBoarding = () => {
  const openOnboarding = () => {
    onboardingState.value.onboardingShown = true
  }

  const closeOnBoarding = () => {
    onboardingState.value.onboardingShown = false
  }

  const toggleOnBoarding = () => {
    onboardingState.value.onboardingShown = !onboardingState.value.onboardingShown
  }

  return {
    openOnboarding,
    closeOnBoarding,
    toggleOnBoarding,
    onboardingState,
  }
}
