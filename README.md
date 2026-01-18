# دليل نشر الموقع

الموقع جاهز للنشر! فيه 3 طرق سهلة:

## الطريقة 1: GitHub Pages (الأسهل والأسرع) ⭐

### الخطوات:

1. **أنشئ repository جديد على GitHub:**
   - اذهب إلى [GitHub](https://github.com)
   - اضغط "New repository"
   - اسمه مثلاً: `student-directory-web`
   - اختار Public
   - **مهم:** لا تضيف README أو .gitignore

2. **ارفع ملفات الموقع:**
   ```bash
   cd "E:\Nour Eldeen\Study\Self Study\Projects\telebot\web"
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/student-directory-web.git
   git push -u origin main
   ```
   
   (استبدل `YOUR_USERNAME` بـ username بتاعك)

3. **فعّل GitHub Pages:**
   - اذهب للـ repository على GitHub
   - Settings > Pages
   - Source: Deploy from a branch
   - Branch: `main` و `/ (root)`
   - Save

4. **الموقع هيبقى متاح على:**
   ```
   https://YOUR_USERNAME.github.io/student-directory-web/
   ```

5. **حدّث البوت:**
   - افتح `bot/.env`
   - غير `WEBSITE_BASE_URL` لرابط الموقع:
     ```
     WEBSITE_BASE_URL=https://YOUR_USERNAME.github.io/student-directory-web
     ```
   - أعد تشغيل البوت

---

## الطريقة 2: Netlify (سهل جداً)

### الخطوات:

1. **ارفع الملفات على GitHub** (مثل الخطوات فوق)

2. **اذهب لـ [Netlify](https://netlify.com)**

3. **اضغط "Add new site" > "Import an existing project"**

4. **اختار GitHub واختار الـ repository**

5. **إعدادات النشر:**
   - Build command: اتركه فاضي
   - Publish directory: `web`
   - اضغط "Deploy site"

6. **الموقع هيبقى متاح على:**
   ```
   https://YOUR-SITE-NAME.netlify.app
   ```

7. **حدّث البوت** (مثل الخطوة 5 في GitHub Pages)

---

## الطريقة 3: Vercel (سهل كمان)

### الخطوات:

1. **ارفع الملفات على GitHub**

2. **اذهب لـ [Vercel](https://vercel.com)**

3. **اضغط "Add New Project"**

4. **اختار الـ repository**

5. **إعدادات:**
   - Framework Preset: Other
   - Root Directory: `web`
   - اضغط "Deploy"

6. **الموقع هيبقى متاح على:**
   ```
   https://YOUR-SITE-NAME.vercel.app
   ```

---

## الطريقة 4: تشغيل محلي (للاختبار)

إذا عايز تجرب الموقع على جهازك قبل النشر:

```bash
cd "E:\Nour Eldeen\Study\Self Study\Projects\telebot\web"

# استخدم Python (إذا مثبت):
python -m http.server 8000

# أو استخدم Node.js (إذا مثبت):
npx http-server -p 8000
```

ثم افتح المتصفح على:
```
http://localhost:8000
```

---

## ملاحظات مهمة:

1. **ملف profiles.json:**
   - البوت هيحدثه تلقائياً بعد كل تسجيل/تعديل
   - تأكد إن الملف موجود في `web/public/profiles.json`

2. **بعد النشر:**
   - سجّل بروفايل من البوت
   - البوت هيحدث `profiles.json` تلقائياً
   - ارفع الملف المحدث على GitHub:
     ```bash
     git add public/profiles.json
     git commit -m "Update profiles"
     git push
     ```

3. **تحديث تلقائي:**
   - يمكنك استخدام GitHub Actions أو Netlify/Vercel auto-deploy
   - أو ببساطة ارفع الملف يدوياً بعد كل تحديث

---

## الأفضل؟

- **GitHub Pages:** مجاني، سهل، مناسب للمشاريع الصغيرة
- **Netlify:** أسرع، فيه auto-deploy من GitHub
- **Vercel:** سريع، مناسب للمشاريع الكبيرة

**أنصح بـ GitHub Pages** لأنها الأسهل والأسرع!
