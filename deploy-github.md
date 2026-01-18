# خطوات نشر الموقع على GitHub Pages (مبسطة)

## الخطوات السريعة:

### 1. أنشئ Repository على GitHub
- اذهب: https://github.com/new
- اسم: `student-directory` (أو أي اسم)
- Public
- لا تضيف README

### 2. ارفع الملفات

افتح PowerShell في مجلد `web`:

```powershell
cd "E:\Nour Eldeen\Study\Self Study\Projects\telebot\web"

# إذا Git مش مثبت، حمّله من: https://git-scm.com/download/win

git init
git add .
git commit -m "First commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/student-directory.git
git push -u origin main
```

(استبدل `YOUR_USERNAME` و `student-directory` بالبيانات بتاعتك)

### 3. فعّل GitHub Pages

- اذهب للـ repository على GitHub
- Settings > Pages
- Source: `main` branch
- Folder: `/ (root)`
- Save

### 4. الموقع جاهز!

الموقع هيبقى على:
```
https://YOUR_USERNAME.github.io/student-directory/
```

### 5. حدّث البوت

افتح `bot/.env` وغير:
```
WEBSITE_BASE_URL=https://YOUR_USERNAME.github.io/student-directory
```

أعد تشغيل البوت.

---

## تحديث الموقع بعد تغيير البيانات:

```powershell
cd "E:\Nour Eldeen\Study\Self Study\Projects\telebot\web"
git add public/profiles.json
git commit -m "Update profiles"
git push
```

---

## مشاكل شائعة:

**المشكلة:** الموقع مش بيحمل `profiles.json`
**الحل:** تأكد إن الملف موجود في `public/profiles.json` وارفعه

**المشكلة:** الموقع فاضي
**الحل:** سجّل بروفايل من البوت أولاً، ثم ارفع `profiles.json`
