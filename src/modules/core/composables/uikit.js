import { inject } from 'vue';

export default function useKit() {
  const uikit = inject('UIKit');
  if (!uikit) {
    throw new Error('No UIKit provided');
  }
  return uikit;
}
