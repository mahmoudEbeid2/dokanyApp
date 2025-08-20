# Campaign API Fix - targetType Issue

## المشكلة
كان هناك خطأ 500 في API عند محاولة عرض الكامبينز بسبب أن الفرونت إند كان يحاول استخدام حقل `targetType` الذي غير موجود في قاعدة البيانات.

## الخطأ
```
Unknown field `targetType` for select statement on model `Campaign`. Available options are marked with ?.
```

## السبب
- الفرونت إند كان يستخدم `campaign.targetType` في عرض البيانات
- لكن قاعدة البيانات تحتوي على `target_type` وليس `targetType`
- هذا تسبب في خطأ 500 عند محاولة عرض الكامبينز

## الحل المطبق

### 1. إصلاح CampaignDetailsScreen.js
- تم استبدال `campaign.targetType` بـ `campaign.target_type` في عرض البيانات
- تم إزالة console.log الذي كان يحاول الوصول لـ `targetType`

### 2. إصلاح CampaignScreen.js
- تم إزالة console.log الذي كان يحاول الوصول لـ `targetType`

### 3. الحفاظ على CreateCampaignScreen.js
- لم يتم تغيير `targetType` في إنشاء الكامبين لأنه صحيح
- المشكلة كانت فقط في عرض البيانات

## الملفات المعدلة
- `src/screens/Campaign/CampaignDetailsScreen.js`
- `src/screens/Campaign/CampaignScreen.js`

## النتيجة
- الآن التطبيق يعمل بدون أخطاء 500
- يمكن عرض الكامبينز بشكل صحيح
- البيانات تعرض من الحقول الصحيحة في قاعدة البيانات

## ملاحظات
- `targetType` يستخدم فقط في إنشاء الكامبين (صحيح)
- `target_type` يستخدم في عرض البيانات (صحيح)
- قاعدة البيانات تحتوي على `target_type` وليس `targetType`
