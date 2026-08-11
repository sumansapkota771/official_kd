/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const iconMap = {
  'CheckCircle2': 'CheckmarkCircle02Icon',
  'Loader2': 'Loading01Icon',
  'Send': 'SentIcon',
  'ArrowRight': 'ArrowRight01Icon',
  'Clock': 'Time02Icon',
  'Signal': 'Wifi01Icon',
  'Trophy': 'Trophy01Icon',
  'Users': 'UserMultiple01Icon',
  'Calendar': 'Calendar01Icon',
  'Rocket': 'Rocket01Icon',
  'Sparkles': 'SparklesIcon',
  'GraduationCap': 'Mortarboard01Icon',
  'Quote': 'QuoteUpIcon',
  'Mail': 'Mail01Icon',
  'MapPin': 'Location01Icon',
  'Phone': 'Call02Icon',
  'ChevronDown': 'ArrowDown01Icon',
  'X': 'Cancel01Icon',
  'Moon': 'Moon02Icon',
  'Sun': 'Sun01Icon'
};

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Replace imports
      const importRegex = /import\s+\{([^}]+)\}\s+from\s+["']lucide-react["'];/g;
      content = content.replace(importRegex, (match, p1) => {
        changed = true;
        const imports = p1.split(',').map(s => s.trim()).filter(Boolean);
        const newImports = imports.map(i => iconMap[i] || i);
        return 'import { ' + newImports.join(', ') + ' } from "hugeicons-react";';
      });

      // Replace icons in JSX
      for (const [lucide, huge] of Object.entries(iconMap)) {
        const tagRegex = new RegExp('<' + lucide + '\\b([^>]*)>', 'g');
        if (tagRegex.test(content)) {
          changed = true;
          content = content.replace(tagRegex, '<' + huge + '$1>');
        }
      }

      // Card style updates
      if (content.includes('rounded-2xl')) {
        changed = true;
        content = content.replace(/rounded-2xl/g, 'rounded-[var(--radius-card)]');
      }
      if (content.includes('border border-border')) {
        changed = true;
        content = content.replace(/border border-border/g, 'border-[0.5px] border-border');
      }
      if (content.includes('border-t border-border')) {
          changed = true;
          content = content.replace(/border-t border-border/g, 'border-t-[0.5px] border-border');
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir('components');
