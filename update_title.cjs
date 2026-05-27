const fs = require('fs');
const path = require('path');

// 1. Update index.html
const indexHtmlPath = path.join(__dirname, 'index.html');
let indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
indexContent = indexContent.replace(/<title>.*?<\/title>/, '<title>Zerde.ai - Transform your customer conversations with AI-powered automation</title>');
indexContent = indexContent.replace(/content=\"Alau.ai[^\"]*\"/g, 'content=\"Zerde.ai - Transform your customer conversations with AI-powered automation\"');
indexContent = indexContent.replace(/alau\.ai/g, 'zerde.ai');
indexContent = indexContent.replace(/Alau\.ai/g, 'Zerde.ai');
fs.writeFileSync(indexHtmlPath, indexContent);

// 2. Update translations.ts
const transPath = path.join(__dirname, 'src', 'shared', 'lib', 'translations.ts');
let transContent = fs.readFileSync(transPath, 'utf8');

// Replace SEO title in ru block
transContent = transContent.replace(
  /title: \"Alau\.ai - AI-агенты для бизнеса в Казахстане\"/,
  'title: \"Zerde.ai - Transform your customer conversations with AI-powered automation\"'
);
transContent = transContent.replace(
  /description:\n\s*\"Платформа ИИ-агентов.*?\"/,
  'description: \"AI-powered automation platform for smart sales, customer support, and business workflows.\"'
);

// Replace SEO title in en block
transContent = transContent.replace(
  /title: \"Alau\.ai - AI agents for business in Kazakhstan\"/,
  'title: \"Zerde.ai - Transform your customer conversations with AI-powered automation\"'
);
transContent = transContent.replace(
  /description:\n\s*\"An AI agent platform.*?\"/,
  'description: \"AI-powered automation platform for smart sales, customer support, and business workflows.\"'
);

// Replace remaining Alau.ai with Zerde.ai and alau.ai with zerde.ai
transContent = transContent.replace(/Alau\.ai/g, 'Zerde.ai');
transContent = transContent.replace(/alau\.ai/g, 'zerde.ai');

fs.writeFileSync(transPath, transContent);

console.log('Update complete.');
