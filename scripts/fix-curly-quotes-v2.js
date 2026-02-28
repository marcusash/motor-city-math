const fs = require('fs');
// Fix curly quotes in RP JSON by replacing with escaped straight quotes
const files = ['data/retake-practice-4.json','data/retake-practice-6.json','data/retake-practice-7.json'];
files.forEach(function(f) {
    var s = fs.readFileSync(f, 'utf-8');
    // Replace curly single quotes with straight single
    s = s.replace(/\u2018/g, "'").replace(/\u2019/g, "'");
    // Replace curly double quotes with escaped straight double (safe inside JSON strings)
    s = s.replace(/\u201c/g, '\\"').replace(/\u201d/g, '\\"');
    // Also fix any already-converted unescaped straight quotes from prior fix
    // Find the pattern: text followed by "something" followed by text (all inside a JSON string)
    // by ensuring JSON is still valid
    try {
        JSON.parse(s);
        fs.writeFileSync(f, s);
        console.log('Fixed and valid: ' + f);
    } catch(e) {
        console.log('ERROR in ' + f + ': ' + e.message);
        // Revert from disk
        console.log('  Not writing -- need manual fix');
    }
});
