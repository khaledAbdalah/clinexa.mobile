import Toast from 'react-native-toast-message';

export function useToast() {
  const showSuccess = (title: string, message?: string) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      visibilityTime: 2000,
    });
  };

  const showError = (title: string, message?: string) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      visibilityTime: 3000,
    });
  };

  const showInfo = (title: string, message?: string) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      visibilityTime: 2000,
    });
  };

  return { showSuccess, showError, showInfo };
}
