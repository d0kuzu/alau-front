const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/Alau\.ai/g, 'Zerde.ai');
    content = content.replace(/alau\.ai/g, 'zerde.ai');
    fs.writeFileSync(filePath, content);
  } catch(e) {}
}

replaceInFile(path.join(__dirname, 'ARCHITECTURE.md'));
replaceInFile(path.join(__dirname, 'src', 'features', 'landing', 'sections', 'About.tsx'));
replaceInFile(path.join(__dirname, 'src', 'features', 'landing', 'sections', 'Contact.tsx'));
replaceInFile(path.join(__dirname, 'src', 'shared', 'components', 'Footer.tsx'));
replaceInFile(path.join(__dirname, 'src', 'features', 'auth', 'pages', 'Auth.tsx'));
replaceInFile(path.join(__dirname, 'src', 'features', 'dashboard', 'pages', 'Dashboard.tsx'));
replaceInFile(path.join(__dirname, 'src', 'features', 'dashboard', 'pages', 'V2Dashboard.tsx'));

console.log('Update complete.');
