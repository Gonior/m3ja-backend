import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const today = new Date();
const date = today.toISOString().split('T')[0]; // format YYYY-MM-DD
const fileName = `${date}.md`;
const logDir = path.join(process.cwd(), 'dev-log');
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
