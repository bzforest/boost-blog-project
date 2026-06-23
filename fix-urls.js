const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('e:\\Learn-code\\Boost Blog Poject\\boost-blog\\apps\\frontend\\src');
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Handle backticks e.g. `http://localhost:4000/api/blogs/${id}`
    content = content.replace(/`http:\/\/localhost:4000\/api\/(.*?)`/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/$1`');

    // Handle double quotes e.g. "http://localhost:4000/api/blogs"
    content = content.replace(/"http:\/\/localhost:4000\/api(\/.*?)"/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}$1`');
    content = content.replace(/"http:\/\/localhost:4000\/api"/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}`');

    // Handle single quotes e.g. 'http://localhost:4000/api/easter-egg'
    content = content.replace(/'http:\/\/localhost:4000\/api(\/.*?)'/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}$1`');
    content = content.replace(/'http:\/\/localhost:4000\/api'/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}`');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
        changedCount++;
    }
});

console.log(`Updated ${changedCount} files.`);
