cd ~/projects/Clinexa/mobile
npx expo prebuild --clean
npx expo run:android --device
eas build --platform android --profile production --local
adb reverse tcp:8081 tcp:8081
