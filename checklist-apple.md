# Apple App Store Release Checklist — Clinexa (`com.clinexa.mobile`)

آخر تحديث: 2026-10-05. المصادر في آخر الملف. نسخة Google في [checklist.md](checklist.md).

---

## 0. مشاكل لازم تتصلح في المشروع قبل الرفع (من فحص الكود)

- [ ] **نصوص الصلاحيات الافتراضية**: `Info.plist` فيه `NSCameraUsageDescription` و`NSMicrophoneUsageDescription` بنص عام ("Allow Clinexa to access your camera/microphone"). Apple بترفض (Guideline 5.1.1) النصوص العامة، ولازم الجملة تشرح **ليه** التطبيق محتاج الصلاحية. الحل: لو مش محتاجهم شيلهم، ولو محتاجهم اكتب نص عربي واضح في `app.json` (`ios.infoPlist`).
  - **الميكروفون** جاي غالباً من `expo-audio`: لو مش بتسجل صوت، اضبط plugin `expo-audio` بـ `microphonePermission: false` أو شيله.
  - **الكاميرا** جاية من `expo-image-picker`: لو مش بتستخدم الكاميرا، اضبط `cameraPermission: false`. ولو بتستخدمها اكتب نص مخصص.
- [ ] **`ITSAppUsesNonExemptEncryption`** مش متحط. من غيره App Store Connect هيسألك عن Export Compliance كل build. حط في `app.json` → `ios.infoPlist`: `"ITSAppUsesNonExemptEncryption": false` (التطبيق بيستخدم HTTPS بس، وده معفي).
- [ ] **Privacy Manifest (`PrivacyInfo.xcprivacy`)**: مفيش ملف في `ios/Clinexa`. Expo SDK 57 بيولّده للمكتبات الرسمية، لكن لازم تعلن أي Required Reason API يستخدمها كودك (UserDefaults، file timestamp، disk space، …) وأي SDK ثالث. ضيف `ios.privacyManifests` في `app.json` وراجع بعد الـ build إن مفيش تحذير "ITMS-91053" في الإيميل.
- [ ] **Sign in with Apple**: `usesAppleSignIn: true` ✅. التطبيق فيه Google Sign-In، وGuideline 4.8 بتطلب خيار دخول مكافئ، وSign in with Apple بيحقق ده ✅.
- [ ] **حذف الحساب**: موجود في التطبيق (`DeleteAccountSheet`) ✅. **لازم** الـ backend يعمل Revoke لتوكن Sign in with Apple (REST API `/auth/revoke`) أثناء الحذف لو المستخدم دخل بـ Apple. Apple بتطلب ده فعلاً. راجع إن الـ backend بيعمله.
- [ ] **رابط الـ Privacy Policy**: `EXPO_PUBLIC_PRIVACY_URL` و`EXPO_PUBLIC_TERMS_URL` لازم يكونوا متعبيين في الـ production env. ولازم الرابط يظهر **جوه التطبيق** (سهل الوصول) و**في App Store Connect**.
- [ ] **`eas.json` → `submit.production`** فاضي. لازم تضيف `ios.ascAppId` (أو تدخله وقت الـ submit) وتجهّز App Store Connect API Key أو Apple ID.
- [ ] **`credentialsSource: "local"`** في `eas.json` بيطبق على iOS كمان: يعني لازم certificate وprovisioning profile محليين. الأسهل تخليها `remote` وEAS يدير التوقيع.
- [ ] **`buildType: "apk"`** تحت `android` بس، مش بتأثر على iOS ✅.
- [ ] **`userInterfaceStyle: "light"`** مقبول ✅.
- [ ] شغّل `npx expo-doctor` قبل الـ build.

---

## 1. حساب المطور

- [ ] **Apple Developer Program** ($99 / سنة). لازم يكون مفعّل ومدفوع قبل أول رفع.
- [ ] **نوع الحساب — مهم جداً للتطبيق ده**: Guideline 5.1.1(ix) بتقول التطبيقات في المجالات المنظّمة (**healthcare** منها) لازم تتقدم من **كيان قانوني (Organization)** بيقدم الخدمة، مش مطور فردي. لو التطبيق طبي ومسجّل بحساب Individual، فيه خطر رفض أو طلب إثبات. الأضمن حساب **Organization**، وده بيحتاج:
  - **D-U-N-S Number** للشركة.
  - موقع إلكتروني بدومين يطابق اسم الشركة.
  - إيميل بدومين الشركة (مش Gmail).
  - تحقق تليفوني قد ياخد أيام لأسابيع، فابدأ بدري.
- [ ] تفعيل **Two-Factor Authentication** على الـ Apple ID.
- [ ] قبول الاتفاقيات الجديدة في App Store Connect (لو في اتفاقية مستنية، الرفع بيتوقف).

---

## 2. متطلبات الـ Build

- [ ] الـ build لازم يتعمل بـ **Xcode 26+ و iOS 26 SDK** (إلزامي من 28 أبريل 2026، وإلا App Store Connect بيرفضه). EAS Build مع Expo SDK 57 بيستخدم الصورة الصح غالباً. تأكد في `eas.json` (`image`) لو فيه override.
- [ ] **Bundle ID** `com.clinexa.mobile` متسجل في Apple Developer ومطابق للتطبيق في App Store Connect. نهائي بعد النشر.
- [ ] **الإصدار والـ build number**: `appVersionSource: remote` + `autoIncrement` ✅. كل رفع لازم build number أعلى.
- [ ] الـ build **release/production** مش development client.
- [ ] **Push Notifications**: `expo-notifications` plugin ✅. بيحتاج **APNs key** (EAS بيعمله ويحفظه). Capability الـ Push متفعلة في الـ App ID.
- [ ] **Sign in with Apple capability** متفعلة في الـ App ID (EAS بيزامنها من `usesAppleSignIn`).
- [ ] **Google Sign-In على iOS**: الـ iOS client ID و`REVERSED_CLIENT_ID` URL scheme مضبوطين في إعدادات plugin الـ google-signin.
- [ ] **أيقونة التطبيق**: 1024×1024 PNG، **بدون شفافية (alpha) وبدون زوايا مدورة**. أي شفافية = رفض تلقائي أثناء المعالجة. `assets/images/icon.png` راجعها.
- [ ] مفيش مكتبات بتستخدم **private APIs** أو بتحمّل كود تنفيذي. `expo-updates` (OTA للـ JS فقط) مقبول.
- [ ] الـ API كله **HTTPS** (App Transport Security). مفيش `NSAllowsArbitraryLoads` إلا لو ضروري ومبرر.

---

## 3. App Store Connect — صفحة التطبيق

- [ ] **الاسم** ≤ 30 حرف، **Subtitle** ≤ 30، **Keywords** ≤ 100 حرف (بفاصلة، بدون مسافات، بدون أسماء منافسين أو علامات تجارية).
- [ ] **الوصف** ≤ 4000 حرف: حقيقي، بدون ادعاءات طبية مضللة، بدون ذكر "Android" أو أسماء منصات تانية.
- [ ] **Screenshots**: لازم على الأقل مجموعة **iPhone 6.9"** (1320×2868) ومجموعة **iPad 13"** (2064×2752) لو التطبيق بيدعم iPad. من 1 لـ 10 صور (PNG/JPG)، وApple بتصغّرهم للأجهزة الأقدم. الصور لازم تكون من التطبيق الحقيقي. (راجع `supportsTablet`، لو مش عايز iPad اضبطه `false`.)
- [ ] **Support URL** (إجباري) — **شغال وفيه محتوى فعلي**. الرابط المعطّل من أكتر أسباب الرفض (Guideline 1.5).
- [ ] **Privacy Policy URL** (إجباري).
- [ ] **Marketing URL** (اختياري).
- [ ] **Category**: Medical أو Health & Fitness.
- [ ] **Copyright** (مثلاً `2026 Clinexa`)، و**Content Rights**: صرّح إن عندك حقوق المحتوى.
- [ ] **السعر والتوفر**: Free، والدول.
- [ ] **What's New** (ملاحظات الإصدار): مطلوبة من التحديث التاني، ومحتاجها لأول إصدار اختياري.

---

## 4. Privacy و Compliance (أهم قسم)

- [ ] **App Privacy ("Nutrition Labels")**: صرّح بكل البيانات المجمّعة، وهل مربوطة بالمستخدم، وهل بتتستخدم للتتبع. للتطبيق ده غالباً:
  - Contact Info: الاسم، الإيميل، رقم التليفون.
  - Health & Fitness / Sensitive Info: أي بيانات طبية أو بيانات مواعيد/عيادات.
  - User Content: الصور المرفقة في بلاغ المشكلة.
  - Identifiers: User ID، **Device ID/Push token**.
  - Diagnostics: لو فيه crash reporting أو analytics.
  - لازم تحسب بيانات **كل SDK** (Google Sign-In، الإشعارات…). **لازم تتطابق مع الـ privacy policy ومع الـ Privacy Manifest**، وApple بتقارن التلاتة.
- [ ] **App Tracking Transparency (ATT)**: لو مفيش تتبع عبر تطبيقات/مواقع تانية ولا إعلانات، اختار "No tracking" ومتحطش `NSUserTrackingUsageDescription`.
- [ ] **Account deletion** ✅ جوه التطبيق (انظر قسم 0). لو الحذف بيتم عبر طلب مش فوري، لازم تعرض للمستخدم تأكيد واضح. (Apple مبتطلبش رابط ويب زي Google، بس مفيد.)
- [ ] **Age Rating**: جاوب على الاستبيان **المحدّث** (فئات جديدة 4+ / 9+ / 13+ / 16+ / 18+). فيه أسئلة جديدة عن الـ in-app controls، والـ capabilities (إنشاء حساب)، والمواضيع الطبية. وفيه أسئلة **Social media** بقت إلزامية من سبتمبر 2026.
- [ ] **Export Compliance**: `ITSAppUsesNonExemptEncryption: false` (انظر قسم 0).
- [ ] **Content Rights / Third-party content**: لو بتعرض محتوى حد تاني لازم تكون مرخّص.
- [ ] **Digital Services Act (DSA) Trader status**: لو هتنشر في دول الاتحاد الأوروبي لازم تعلن حالتك كـ Trader/Non-trader (وبيانات الاتصال بتظهر للعامة).

---

## 5. معايير المراجعة (Review Guidelines) — اللي بتسبب رفض فعلاً

- [ ] **2.1 App Completeness (أكتر سبب رفض)**:
  - **حساب تجريبي شغال** في **App Review Information**. بما إن الدخول بـ OTP، **لازم تدّي طريقة تعدّي الـ OTP** (حساب بكود ثابت، أو demo mode بموافقة مسبقة من Apple). المراجع مش هيستلم رسالة WhatsApp أو إيميل. اكتب خطوات الدخول بالتفصيل.
  - **السيرفر شغال** وقت المراجعة (24/7 لحد ما تتقبل).
  - مفيش placeholder أو "قريباً" أو أزرار ميتة.
  - جرّب على **جهاز حقيقي** (iPhone وiPad لو بتدعمه).
- [ ] **1.4.1 Medical**: التطبيق طبي، فهيتراجع بدقة أكبر:
  - وضّح في الوصف والتطبيق إنه **للحجز والإدارة وليس تشخيص**، وأضف **تنبيه استشارة الطبيب** لو بيعرض أي معلومة طبية.
  - مفيش ادعاءات قياس صحي (ضغط، سكر، حرارة…) بحساسات الجهاز بس.
  - لو التطبيق تشخيصي أو مسجّل كجهاز طبي، ارفق وثائق الترخيص.
- [ ] **5.1.1 Data Collection**: متطلبش بيانات شخصية مش لازمة للوظيفة الأساسية. متفرضش تسجيل دخول لو الميزات ممكن تشتغل من غيره (لو فيه أجزاء عامة).
- [ ] **5.1.2 / 5.1.3 Health data**: مفيش استخدام أو مشاركة لبيانات صحية للإعلانات أو التسويق أو data mining. اطلب موافقة صريحة قبل أي مشاركة مع طرف ثالث (بما فيه AI).
- [ ] **4.8 Login Services**: Sign in with Apple موجود ✅ ويظهر **بنفس أهمية** زرار Google (حجم وترتيب مناسبين).
- [ ] **4.5.4 Push**: الإشعارات **مش شرط لعمل التطبيق**، ولا تُستخدم للتسويق بدون opt-in صريح، ولا تحمل **بيانات طبية حساسة** في نصها (مثلاً بدل اسم المرض اكتب "عندك تحديث في موعدك").
- [ ] **4.2 Minimum Functionality**: التطبيق مش مجرد WebView/موقع مغلّف، وبيقدم قيمة أصلية.
- [ ] **UGC (1.2)**: لو المستخدمين بيرسلوا محتوى (بلاغات + صور) وبيظهر لمستخدمين تانيين، لازم فلترة وآلية إبلاغ وحظر. لو الشكاوى خاصة بين المستخدم والإدارة بس، وضّح ده.
- [ ] **2.3 Accurate Metadata**: الـ screenshots والوصف يعكسوا التطبيق الفعلي، ومفيش مقارنات بمنتجات تانية.
- [ ] **RTL / عربي**: تأكد إن النصوص مش مقطوعة، وإن الـ layout سليم على أصغر iPhone وأكبر iPad.
- [ ] **التطبيق مش بيكراش** ومفيش رسايل خطأ فارغة أو شاشات بيضاء. Apple بتجرّب بشبكة بطيئة وبدون إذن الإشعارات والصور.
- [ ] **الصلاحيات تُطلب وقت الحاجة** مع شرح، والتطبيق **يشتغل لو المستخدم رفضها** (مفيش كراش أو شاشة عالقة).

---

## 6. App Review Information (قسم بيتنسى)

- [ ] **Sign-in required** ✅ مع Username/Password (أو الطريقة البديلة).
- [ ] **Contact**: اسم، تليفون، إيميل بيردوا فعلاً (ممكن Apple تتصل).
- [ ] **Notes**: اشرح بالإنجليزي:
  1. طريقة الدخول بالحساب التجريبي وتخطي الـ OTP.
  2. إن التطبيق للحجز/الإدارة الطبية وليس تشخيص.
  3. أي ميزة محتاجة صلاحية أو مكان معين.
  4. إن الخدمة مقدمة من [اسم الكيان القانوني] (مهم لـ 5.1.1(ix)).
- [ ] **Attachment**: لو في فيديو يشرح الـ flow أو وثائق ترخيص، ارفقها.

---

## 7. مسار الرفع (الترتيب المقترح)

1. [ ] إنشاء/تفعيل Apple Developer Program (ويفضل Organization، قسم 1).
2. [ ] إصلاح بنود قسم 0.
3. [ ] إنشاء التطبيق في App Store Connect (Bundle ID، الاسم، اللغة الأساسية، SKU).
4. [ ] `eas build --platform ios --profile production`.
5. [ ] `eas submit --platform ios` (أو Transporter) وانتظر المعالجة (10–30 دقيقة).
6. [ ] **TestFlight**: اختبر الـ build على جهاز حقيقي (Internal testing فوري، External testing بيحتاج Beta App Review). جرّب: Apple Sign-In، Google Sign-In، OTP، الإشعارات، حذف الحساب.
7. [ ] أكمل الـ metadata والـ Privacy والـ Age Rating وApp Review Information.
8. [ ] اختار الـ build وأرسل بـ **Add for Review → Submit**.
9. [ ] المراجعة بتاخد غالباً 24–48 ساعة (أول مرة ممكن أكتر). لو اترفضت، رد على Resolution Center وعدّل وارفع تاني.
10. [ ] اختار Release: **Manual** أو **Automatic** أو **Phased**.

---

## 8. أسباب الرفض الأكثر شيوعاً (راجعها قبل الإرسال)

| السبب (Guideline) | الحل |
|---|---|
| لا يوجد حساب تجريبي / OTP مش بيشتغل للمراجع (2.1) | حساب بكود ثابت + شرح في Notes |
| السيرفر واقف أو بطيء وقت المراجعة (2.1) | تأكد إنه شغال 24/7 |
| Support URL أو Privacy URL مش شغالين (1.5 / 5.1.1) | صفحات عامة فيها محتوى حقيقي |
| App Privacy مش مطابق للسلوك الفعلي (5.1.1) | راجع كل SDK، وطابق مع الـ policy والـ manifest |
| نصوص صلاحيات عامة (5.1.1) | اكتب سبب واضح بالعربي لكل صلاحية |
| صلاحيات غير مستخدمة (ميكروفون/كاميرا) | شيلها |
| تطبيق طبي من حساب فردي (5.1.1(ix)) | حساب Organization |
| ادعاءات طبية أو بدون disclaimer (1.4.1) | disclaimer + وصف "حجز وإدارة" |
| لا يوجد حذف حساب أو Apple token مش بيتلغي (5.1.1(v)) | حذف داخل التطبيق + revoke من الـ backend |
| أيقونة فيها شفافية | PNG 1024 بدون alpha |
| Screenshots مش من التطبيق أو بمقاس غلط (2.3) | لقطات حقيقية بمقاس 6.9" |
| كراش أو شاشة بيضاء | اختبر release build على جهاز حقيقي |

---

## المصادر

- [App Review Guidelines — Apple Developer](https://developer.apple.com/app-store/review/guidelines/)
- [Upcoming Requirements (SDK minimums) — Apple Developer](https://www.developer.apple.com/news/upcoming-requirements/)
- [Screenshot specifications — App Store Connect Help](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications)
- [Get started with privacy manifests — WWDC23](https://developer.apple.com/videos/play/wwdc2023/10060/)
- [iOS App Store Review Guidelines 2026 — AppFollow](https://appfollow.io/blog/app-store-review-guidelines)
- [App Store Rejection Reasons in 2026 — Applander](https://www.applander.io/blog/app-store-rejection-reasons-2026)
- [App Store age ratings overhaul — PTKD](https://ptkd.com/journal/app-store-age-ratings-2025-update)
- [Social media age rating questions — 9to5Mac](https://9to5mac.com/2026/07/09/apple-adds-social-media-questions-to-app-store-connect-age-rating-questionnaire/)
- [Apple App Store Privacy Policy Requirements (2026)](https://ultrafastutilities.com/apple-app-store-privacy-policy-requirements)
