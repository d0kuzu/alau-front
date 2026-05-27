const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/Alau<span/g, 'Zerde<span');
    fs.writeFileSync(filePath, content);
  } catch(e) {}
}

replaceInFile(path.join(__dirname, 'src', 'features', 'dashboard', 'pages', 'Dashboard.tsx'));
replaceInFile(path.join(__dirname, 'src', 'shared', 'components', 'Header.tsx'));

console.log('Update complete.');
