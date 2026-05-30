const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = content.replace(/<img([\\s\\S]*?)src=/g, (match, p1) => {
                if (p1.includes('onError')) return match;
                return `<img onError={(e) => { e.currentTarget.src = "https://placehold.co/600x600/f3f4f6/9ca3af?text=No+Image" }} ${p1}src=`;
            });
            if (updated !== content) {
                fs.writeFileSync(fullPath, updated, 'utf8');
                console.log('Updated ' + fullPath);
            }
        }
    }
}

replaceInDir('./src');
console.log('done');
