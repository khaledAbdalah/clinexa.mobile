# Google Play Release Checklist — Clinexa (`com.clinexa.mobile`)

آخر تحديث: 2026-10-05. المصادر في آخر الملف. السياسات بتتغير، فراجع Play Console قبل الرفع.

---

## 0. مشاكل لازم تتصلح في المشروع قبل الرفع (من فحص الكود)

- [ ] **`eas.json` → production → `buildType: "apk"`**: Google Play بيقبل **AAB (App Bundle)** بس. غيّرها لـ `"app-bundle"` (أو شيل الـ override، الـ default للـ production هو AAB). الـ APK للتجربة المحلية بس.
- [ ] **`credentialsSource: "local"`**: لازم يبقى عندك `credentials.json` وملف keystore فعلاً، أو غيّرها لـ `remote` وخلي EAS يدير الـ keystore. **متضيّعش الـ upload keystore.**
- [ ] **`RECORD_AUDIO` permission موجودة في الـ manifest** (جاية من `expo-audio`). لو التطبيق مش بيسجل صوت فعلاً: شيلها بـ `blockedPermissions` في `app.json`، أو لازم تبرر استخدامها في Play Console. Google بتسأل عن الصلاحيات الحساسة.
- [ ] **`SYSTEM_ALERT_WINDOW` permission موجودة** (غالباً من dev client). صلاحية حساسة وممكن تسبب رفض. شيلها من الـ production build (`blockedPermissions: ["android.permission.SYSTEM_ALERT_WINDOW"]`) وتأكد إن الـ manifest النهائي نضيف.
- [ ] **`READ/WRITE_EXTERNAL_STORAGE`**: لو مش محتاجهم فعلاً شيلهم. `expo-image-picker` بيستخدم photo picker ومش محتاج صلاحيات واسعة.
- [ ] **رابط الـ Privacy Policy والـ Terms**: `constants/links.ts` بيقراهم من `EXPO_PUBLIC_PRIVACY_URL` و `EXPO_PUBLIC_TERMS_URL`. تأكد إنهم **متعبيين في الـ production env (EAS env/secrets)** مش `''`، وإن الصفحات شغالة وعامة.
- [ ] **حذف الحساب**: موجود جوه التطبيق (`DeleteAccountSheet`) ✅. لسه ناقص **رابط ويب** لطلب حذف الحساب (انظر قسم 3).
- [ ] **`android:allowBackup="true"`**: مش سبب رفض، لكن التطبيق طبي وفيه توكنات. يُفضّل `allowBackup: false` في `app.json` (`android.allowBackup`).
- [ ] **`targetSdk`**: React Native 0.86 بيستخدم `targetSdk = 36` ✅ (متطلب Google من 31 أغسطس 2026). تأكد من الـ AAB النهائي.
- [ ] **`version` / `versionCode`**: `appVersionSource: remote` + `autoIncrement` شغالين ✅. كل رفع لازم versionCode أعلى.
- [ ] **`adaptiveIcon`**: أضف `backgroundColor` (أو `backgroundImage`) في `app.json` لو الأيقونة شفافة، وتأكد إن الـ foreground جوه الـ safe zone (66% من الوسط).
- [ ] **`userInterfaceStyle: "light"`** مقبول، بس تأكد إن التطبيق مش بيتكسر لو الجهاز Dark.
- [ ] شغّل `npx expo-doctor` و `pnpm lint` و `npx tsc --noEmit` قبل الـ build.

---

## 1. حساب المطور (Play Console)

- [ ] حساب مطور مدفوع ($25 مرة واحدة).
- [ ] **التحقق من الهوية (Developer Verification)**: إلزامي للحسابات الجديدة من سبتمبر 2026. محتاج هوية حكومية بصورة، إثبات عنوان، وتحقق رقم تليفون. وكمان تحقق من جهاز أندرويد. ابدأه بدري لأنه ممكن ياخد أيام.
- [ ] **نوع الحساب**:
  - **Personal account اتعمل بعد 13 نوفمبر 2023** ← لازم **Closed Test بـ 12 Tester على الأقل، كلهم مشتركين متواصل 14 يوم** قبل ما تقدم على Production access. ده أكبر مضيّع للوقت، **ابدأ فيه أول حاجة**.
  - **Organization account** ← مفيش المتطلب ده، لكن محتاج D-U-N-S Number وتحقق أطول.
- [ ] بيانات الاتصال (إيميل ورقم تليفون) صحيحة. الاسم/البريد/الدولة بتظهر في صفحة التطبيق.

---

## 2. متطلبات ملف التطبيق (App Bundle)

- [ ] الصيغة **AAB** ✅ (انظر قسم 0).
- [ ] **Target API 36 (Android 16) أو أعلى** للتطبيقات الجديدة والتحديثات (من 31 أغسطس 2026). متحقق من React Native 0.86.
- [ ] **دعم 16 KB page size**: إلزامي لأي تطبيق يستهدف Android 15+. React Native/Expo SDK 57 بيدعموه، بس أي مكتبة native تانية (MMKV, reanimated, google-signin, …) لازم تكون على نسخ حديثة. افحص بعد الرفع من **App Bundle Explorer** في Play Console أو محلياً بـ `zipalign -c -P 16 -v 4 app.aab`.
- [ ] **Play App Signing** مفعّل (إجباري لأي تطبيق جديد). EAS بيرفع بـ upload key وGoogle بتوقّع.
- [ ] **اسم الباكيدج** `com.clinexa.mobile` نهائي ومينفعش يتغير بعد النشر.
- [ ] حجم الـ AAB تحت 200MB (مش مشكلة هنا غالباً).
- [ ] الـ build المرفوع **release** مش development client (`developmentClient: false`)، ومفيش `expo-dev-client` في الـ production.

---

## 3. App content (Policy → App content) — كل الأقسام لازم تتملى

كل قسم ناقص بيمنع النشر.

- [ ] **Privacy policy**: رابط عام شغال (مش PDF محمّل، مش صفحة login). لازم يوضح بالتفصيل: إيه البيانات اللي بتتجمع، ليه، مع مين بتتشارك، مدة الاحتفاظ، وإزاي المستخدم يحذف بياناته. **يتطابق مع Data safety form بالظبط.** لأن التطبيق طبي، اذكر البيانات الصحية صراحة.
- [ ] **App access**: التطبيق محتاج تسجيل دخول، فلازم تدّي Google **بيانات حساب تجريبي شغال** (إيميل/باسورد أو رقم + طريقة استلام الـ OTP). **ده أشهر سبب للرفض.** بما إن الدخول بـ OTP عبر WhatsApp/إيميل، جهّز حساب تجريبي بـ OTP ثابت أو بدون OTP، وإلا المراجع مش هيعرف يدخل. وضّح كل الخطوات.
- [ ] **Ads**: صرّح هل فيه إعلانات (غالباً لا).
- [ ] **Content rating**: املا استبيان IARC.
- [ ] **Target audience and content**: اختار الفئة العمرية (غالباً 18+ أو 13+). **متحطش أطفال تحت 13** إلا لو هتلتزم بسياسة Families.
- [ ] **Data safety form**: صرّح بكل البيانات المجمّعة: الاسم، الإيميل، رقم التليفون، الصور (image picker)، معرّفات الجهاز/توكن الإشعارات (FCM)، أي بيانات صحية/طبية، بيانات Google/Apple sign-in، تقارير الأعطال/analytics لو فيه. وضّح: متشفرة أثناء النقل؟ (HTTPS)، المستخدم يقدر يطلب الحذف؟ ولازم تذكر بيانات الـ SDKs التانية (Google Sign-In, Firebase, Expo notifications).
- [ ] **Account deletion**: لازم (1) مسار داخل التطبيق ✅ و(2) **رابط ويب** لطلب حذف الحساب والبيانات، يكون شغال، واضح، ويذكر اسم التطبيق/المطور. ممكن صفحة بسيطة فيها نموذج أو إيميل دعم. حطه في Data safety form. لازم الحذف الفعلي للبيانات المرتبطة مش تجميد الحساب بس (ممكن تحتفظ بحاجات قانونية/أمان وتوضحها).
- [ ] **Health apps declaration**: بما إن Clinexa تطبيق عيادات/طبي، املا **Health apps declaration** (فيه خيارات: Medical info/reference، Clinical decision support، إلخ). وضّح إن التطبيق مش بديل عن التشخيص الطبي، وأضف Disclaimer في التطبيق والـ listing لو بيعرض معلومات طبية. لو بيحجز مواعيد بس، اختار الأنسب (مثلاً Healthcare services / Not a medical device) حسب وظيفة التطبيق الفعلية. **لو التطبيق بيقدم تشخيص أو قياسات صحية ممكن يتطلب موافقات تنظيمية.**
- [ ] **Financial features declaration**: لو فيه دفع أو محفظة اختار المناسب، لو لأ اختار "My app doesn't provide any financial features".
- [ ] **Government apps / News apps / COVID-19 / Advertising ID**: املا كل واحد. **Advertising ID**: لو مفيش إعلانات ولا SDK بيستخدمه، صرّح بـ "No". (لو الـ manifest النهائي فيه `AD_ID` من مكتبة، لازم تصرّح.)
- [ ] **Permissions declaration**: لو أي صلاحية حساسة اتحطت (انظر قسم 0)، جهّز تبرير وفيديو توضيحي.
- [ ] **User-generated content**: لو المستخدمين بيرفعوا محتوى/بلاغات (فيه إرفاق صور في بلاغ مشكلة) راجع سياسة UGC: لازم آلية إبلاغ/حظر لو فيه محتوى متاح لمستخدمين تانيين.

---

## 4. صفحة المتجر (Store listing)

- [ ] **اسم التطبيق** ≤ 30 حرف. بدون كلمات ترويجية ("الأفضل"، "#1"، "مجاني")، وبدون رموز/إيموجي مضللة.
- [ ] **وصف قصير** ≤ 80 حرف، **وصف كامل** ≤ 4000 حرف. بدون كلمات مفتاحية مكررة (keyword stuffing) أو ادعاءات كاذبة.
- [ ] **أيقونة التطبيق** 512×512 PNG، ≤ 1MB.
- [ ] **Feature graphic** 1024×500 PNG/JPG (إجباري).
- [ ] **Screenshots للموبايل**: 2 على الأقل (الأفضل 4–8)، نسبة 16:9 أو 9:16، كل ضلع بين 320 و3840 px. لازم تعكس التطبيق الحقيقي بدون محتوى مضلل.
- [ ] تصنيف التطبيق (Medical / Health & Fitness) واختيار Tags مناسبة.
- [ ] **بيانات الاتصال بالدعم**: إيميل (إجباري)، وموقع/تليفون (اختياري).
- [ ] ترجمة الـ listing للعربي (والإنجليزي كـ default لو حابب).
- [ ] مفيش ادعاءات طبية مضمونة ("بيعالج"، "بيشخّص") بدون إثبات، ومفيش استخدام علامات تجارية/أسماء مستشفيات بدون إذن.

---

## 5. سياسات الجودة والسلوك (اللي بتسبب رفض فعلاً)

- [ ] التطبيق **مش بيكراش** عند التشغيل وبيشتغل على Android حقيقي (جرّب `release` build مش dev). Google بتقيس crash rate و ANR بعد النشر.
- [ ] **Minimum functionality**: التطبيق بيقدم قيمة حقيقية، مش مجرد WebView لموقع.
- [ ] **مفيش محتوى placeholder / "Lorem ipsum" / شاشات "قريباً"** بدون وظيفة.
- [ ] **كل الروابط والأزرار شغالة**، مفيش أزرار ميتة.
- [ ] **Sign in with Google**: تأكد من SHA-1 / SHA-256 بتاعة **Play App Signing key** (من Play Console → App integrity) مضافة في Google Cloud/Firebase OAuth client، وإلا تسجيل الدخول بجوجل **هيفشل على نسخة المتجر** رغم إنه شغال محلياً.
- [ ] **Sign in with Apple**: مطلوب على iOS بس لو فيه social login (متحط ✅). مش مطلوب على Android.
- [ ] **الإشعارات (FCM)**: `google-services.json` موجود وصحيح للـ package، والـ Android 13+ بيطلب `POST_NOTIFICATIONS` وقت التشغيل (اطلبها بسياق مفهوم). إعداد FCM credentials في EAS مضبوط وإلا الإشعارات مش هتوصل.
- [ ] **كل الصلاحيات تُطلب وقت الحاجة** مع شرح واضح (مش كلها عند فتح التطبيق).
- [ ] **مفيش كود/روابط لتحميل تحديثات خارج Play**. استخدام `expo-updates` (OTA للـ JS فقط) مقبول، لكن مينفعش تحمّل كود native تنفيذي.
- [ ] **مفيش مفاتيح/أسرار** في الـ bundle (`EXPO_PUBLIC_*` بتتشاف). الـ API على **HTTPS** بس (مفيش cleartext).
- [ ] الـ API الإنتاجي **شغال ومتاح** وقت المراجعة (السيرفر مش واقف، ومش على localhost/staging).
- [ ] دعم **RTL والعربي** سليم، ومفيش نص مقطوع (ده تجربة مستخدم، مش سبب رفض مباشر).
- [ ] **Edge-to-edge** في Android 15+/16: تأكد إن الـ UI مش بيتغطى بالـ status/navigation bars (التطبيق بيخفي navigation bar عبر `expo-navigation-bar`، اختبره على Android 15/16).
- [ ] اختبار على أكتر من جهاز وحجم شاشة (Pre-launch report في Play Console بيعمل ده تلقائي بعد الرفع، راجع نتايجه).

---

## 6. مسار الرفع والنشر (الترتيب المقترح)

1. [ ] إنشاء حساب المطور + إكمال التحقق من الهوية.
2. [ ] إصلاح بنود قسم 0.
3. [ ] `eas build --platform android --profile production` (AAB).
4. [ ] إنشاء التطبيق في Play Console (الاسم، اللغة، Free/Paid، الإقرارات).
5. [ ] رفع أول AAB على **Internal testing** (فوري تقريباً) وجرّبه على جهاز حقيقي من المتجر (اختبار Google Sign-In + الإشعارات + OTP).
6. [ ] استكمال **App content** و **Store listing** بالكامل (أقسام 3 و4).
7. [ ] لو Personal account جديد: رفع على **Closed testing** + إضافة **12+ tester** (بإيميلات Google) والانتظار **14 يوم متواصل** (لازم يفضلوا opted-in).
8. [ ] **Apply for production access** وجاوب على أسئلة Google (كيف اختبرت، feedback، إلخ). المراجعة بتاخد غالباً بضعة أيام.
9. [ ] إنشاء **Production release**، اكتب Release notes، حدّد الدول، وأرسل للمراجعة (Review الأول ممكن ياخد من 1 لـ 7 أيام، وأحياناً أكتر).
10. [ ] بعد النشر: راقب Android vitals (crash/ANR) و Pre-launch report.

---

## 7. أسباب الرفض الأكثر شيوعاً (راجعها قبل الإرسال)

| السبب | الحل |
|---|---|
| المراجع مقدرش يسجل دخول | حساب تجريبي + تعليمات واضحة في App access (خصوصاً OTP) |
| Privacy policy ناقصة/مش شغالة/مش متطابقة مع Data safety | صفحة عامة تفصيلية، وتطابق مع الـ SDKs المستخدمة |
| Data safety غير دقيق | راجع كل SDK (Google Sign-In, notifications, image picker) |
| لا يوجد رابط ويب لحذف الحساب | صفحة حذف حساب عامة |
| صلاحيات غير مبررة (`RECORD_AUDIO`, `SYSTEM_ALERT_WINDOW`) | شيلها أو برّرها |
| ادعاءات طبية/Health declaration ناقصة | املا الـ Health declaration + disclaimer |
| Target API قديم | API 36 ✅ |
| كراش عند الفتح على release build | جرّب release build محلياً قبل الرفع |
| بيانات المتجر مضللة (اسم/وصف/screenshots) | كلام حقيقي، بدون keyword stuffing |

---

## المصادر

- [Target API level requirements — Play Console Help](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en)
- [App testing requirements for new personal developer accounts — Play Console Help](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)
- [App account deletion requirements — Play Console Help](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en)
- [User Data policy — Play Console Help](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en)
- [Provide information for Google Play's Data safety section / App content](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en)
- [Prepare your app for review — Play Console Help](https://support.google.com/googleplay/android-developer/answer/9815348)
- [Required information to create a Play Console developer account](https://support.google.com/googleplay/android-developer/answer/13628312?hl=en)
- [16 KB page size requirement — Median guide](https://median.co/blog/how-to-prepare-android-apps-google-play-16-kb-page-size-requirement)
- [Google Play Developer Verification 2026 — TesterBee](https://testerbee.com/blog/google-play-developer-verification-2026)
- [Google Play Closed Testing Requirements 2026 — Testerscommunity](https://www.testerscommunity.com/blog/google-play-closed-testing-requirements-2026)
