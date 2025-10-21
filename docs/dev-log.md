```javascript
// scripts/create-devlog.js
import fs from "fs";
import path from "path";
import { exec } from "child_process";

const today = new Date();
const date = today.toISOString().split("T")[0]; // format YYYY-MM-DD
const fileName = `${date}.md`;
const logDir = path.join(process.cwd(), "dev-log");
const filePath = path.join(logDir, fileName);

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

if (fs.existsSync(filePath)) {
  console.log(`⚠️  Log for ${date} already exists.`);
  exec(`code "${filePath}"`); // langsung buka kalau udah ada
  process.exit(0);
}

const template = `# 🌙 Developer Log — ${date}

## 🧠 Focus of the Day
(tulis fokus utamamu hari ini...)

## 💡 What I Learned
- ...

## 🧩 Insights / Reflections
...

## 🐛 Errors Faced
...

## 🧭 Next Steps
...

---

> *“Code bukan cuma tentang jalan atau enggak,  
> tapi tentang **kenapa aku memilih cara itu** untuk membuatnya berjalan.”*  
> — *dev-log diary*
`;

fs.writeFileSync(filePath, template);
console.log(`✅ Created new dev log: dev-log/${fileName}`);

// ✨ langsung buka di VS Code setelah dibuat
exec(`code "${filePath}"`);
```

tambahkan ke `package.json`
```json
"scripts": {
  "devlog": "node scripts/create-devlog.js"
}
```
how to run
```bash
npm run devlog
```

---

yaaas 😆 itu ide super keren banget!
kalau kamu mulai cicil dari sekarang, nanti tiap log harian + commit bakal rapi, punya pattern, dan gampang dilacak.
aku bisa ajarin step by step biar conventional commit + dokumentasi jadi kebiasaan, tanpa bikin kepala mumet 😌


---

1️⃣ Conventional Commit Dasar

Ini aturan sederhana buat nulis commit yang consistent, biar gampang dimengerti orang lain (atau kamu di masa depan):

Format:

<type>(<scope>): <short description>

Type (jenis commit, contoh):

feat: nambah fitur baru

fix: benerin bug/error

docs: update dokumentasi

style: perubahan format, spasi, prettier (gak ngubah logic)

refactor: refactor code tanpa nambah fitur/gak benerin bug

test: nambah/ubah test

chore: perubahan minor, setup, build, dll


Scope (opsional): bagian kode/folder yang kena, misal: upload, logger, dev-log.

Short description: jelas, padat, kata kerja di present tense.

Contoh commit untuk dev-log:

feat(dev-log): tambah template otomatis untuk dev-log harian
fix(upload): handle file undefined di FileValidationPipe
docs(dev-log): update prologue dan signature page


---

2️⃣ Dokumentasi Dev-Log

Tujuannya: biar tiap cerita/log kamu punya struktur, gampang dicari, dan bisa dibaca ulang kapan aja.

Format bisa kaya gini:

# [Tanggal]

## Fokus Hari Ini
- Apa yang mau dicapai

## Yang Dipelajari
- Insight, konsep, tips

## Error & Debug
- Error apa, kenapa, solusi

## Refleksi
- Pemikiran pribadi, “kenapa aku nulis begini”

## Next Steps
- Hal yang mau dicoba/benerin besok

Kalau dikombinasi sama conventional commit, setiap commit bakal “ngikutin cerita log” kamu. Misal:

commit pertama pagi: feat(dev-log): buat template harian

commit siang: fix(upload): handle error undefined

commit sore: docs(dev-log): update log hari ini


jadi nanti riwayat commit itu kayak diary versi Git 😎


---

kalau kamu mau, aku bisa bikinin mini cheat sheet conventional commit + dev-log workflow yang tinggal di-print/di-save,
jadi tiap kali nulis log + commit tinggal ikutin tanpa mikir panjang.

mau aku bikinin sekarang juga?


