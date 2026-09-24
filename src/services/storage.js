// طبقة تجريد فوق LocalStorage
// الهدف: عندما نربط المشروع بـ Backend مستقبلاً، نستبدل محتوى هذا الملف فقط
// (أو الدوال داخل كل service) دون الحاجة لتعديل أي Component

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`خطأ في قراءة ${key} من LocalStorage`, err);
    return fallback;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`خطأ في حفظ ${key} في LocalStorage`, err);
    return false;
  }
};

// محاكاة تأخير الشبكة البسيط، يسهّل الانتقال لاحقًا إلى async API حقيقي
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

export const storage = { read, write, delay };
