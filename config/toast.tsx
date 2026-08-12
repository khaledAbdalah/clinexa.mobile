import {
  BaseToast,
  ErrorToast,
  type BaseToastProps,
  type ToastConfig,
} from 'react-native-toast-message';
import { Colors } from '@/constants/theme';

const text1Style = { fontFamily: 'app-font-semibold', fontSize: 14 };
const text2Style = { fontFamily: 'app-font-regular', fontSize: 12 };

function successToast(props: BaseToastProps) {
  return (
    <BaseToast
      {...props}
      style={{ borderLeftColor: Colors.light.primary }}
      text1Style={text1Style}
      text2Style={text2Style}
    />
  );
}

function errorToast(props: BaseToastProps) {
  return <ErrorToast {...props} text1Style={text1Style} text2Style={text2Style} />;
}

function infoToast(props: BaseToastProps) {
  return (
    <BaseToast
      {...props}
      style={{ borderLeftColor: Colors.light.textSecondary }}
      text1Style={text1Style}
      text2Style={text2Style}
    />
  );
}

export const toastConfig: ToastConfig = {
  success: successToast,
  error: errorToast,
  info: infoToast,
};
