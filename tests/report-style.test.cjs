const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
// Content fingerprints from the original publish commit recorded in the README.
const originals = {
    'reviews/assessment-2-mini-quiz-2026-11-10.html': '646fb996b3dd4d3405aa6859ae60ba9ffd6dc6bc6fd48707631b9e7a43dcfa73',
    'reviews/assessment-1-functions-75min-grade.html': 'b5339e816723a1b6e5ee5671046645d2fb062f24425469781b386e86bce4e9ac',
    'reviews/assessment-1-midterm-functions-grade.html': '05f3d127284e23b5beab6d8bbda59a821da6b9644502c702bd855717e783f6b5',
    'reviews/assessment-2-rational-functions-grade.html': '18548055bb6cfc62f519be755f4814a2e69d8ba2e864ea666450b51512eb8947',
    'reviews/kai-assessment1a-2026-04-08.html': '9568b992e8f2a591a4263da42792d9d5bc7bf3c2b8e9f4d539e8d35600d33a08',
    'reviews/kai-assessment2a-2026-05-16.html': '6e5e0b7857d773951247284a91ff53b05932b8d78829180d590725cef37af126',
    'reviews/kai-assessment3-2026-06-07.html': '354956056bbbdef4db10653abf39401db1cf63f3ed80ae180976bf04452f19ce',
    'reviews/kai-logs-practice-2026-05-14.html': 'cbf25f5636a2bab1f17521a43df4a5823f88fb9aa69432260d172a7000ba81c6',
    'reviews/kai-poly-division-2026-03-21.html': 'e68d3a46f546b479d9a61310fa1fa2441dbc420b1adf792c5d0c07e6a9935ee6',
    'reviews/kai-quiz1-2026-03-21.html': 'b3f502ad549cb5d52a9eacd464f2a85e904f19813ed9b10a74a5bb0a4d29e184',
    'reviews/kai-quiz2-2026-04-04.html': '7e963f12f2b21b4ae3e7ee6f602f026a0c8309521fcf56be15ffdded4b744ce2',
    'reviews/kai-quiz2-retake-2026-04-05.html': '5e3053577867778085eb341fc735a03fff889a77e7dfeab38e25fb4bc7893548',
    'reviews/kai-s4-gap-drill-1-2026-05-17.html': '199a9f63a00b7e87c694df9d4f22fbd4d8b3323d16c207f172b33ed5ecc2e617',
    'reviews/kai-s5-practice-quiz-b-2026-05-25.html': '07ec669d46a5de818d325ef559aa34ef6d5d57229c0747714e59d2d2ada912bd',
    'reviews/kai-unit1-practice-exam-2026-04-05.html': '5acf7382dc7018b09e33379e5c3c59f4588a12e144b3b5c2fa6251feae32ce6b',
    'reviews/kai-unit1-practice-test-2-2026-04-06.html': '78c4c1397341f6196487a19c902faed3d606520b922c49816a8ef4f7cb99f3cf',
    'reviews/prep-test-2-proposal.html': 'df1d9c2e7c50777d6ea10142fc498fea121aa5b9cc0dad1f6a177565e12412cd',
    'reviews/test-1-study-guide.html': '22a99c11c1139f0a55b9082eec68e5182c799df2303ad8f0572dc66c14741766',
    'scores/practice-quiz-c-grade-report.html': '9b6787cb21888b09b67f2673f78760e1ed2c1d7414f5408b72a5c4038b3424ee'
};
const dataOriginals = {
    'reviews/assessment-2-mini-quiz-2026-11-10-data.js': 'a1d6094a242021ca53b475d79031789b3a28a8683a93e05d9723cc940e866df2',
    'reviews/assessment-1-functions-75min-grade-data.js': '7e85c00c1182282b83cec8096069639ba2dc4cf5435b5807a5c95b5817ebbe0a',
    'reviews/assessment-1-midterm-functions-grade-data.js': '7d521b4bb466d5e48ee610baeb9dfb61f8ba9c87e61e87adfa5832ecab836767',
    'reviews/assessment-2-rational-functions-grade-data.js': '320377044a4bf0f83ec8cef2e75ba7ca883a51033052a70cb00f0903dbce0240',
    'reviews/prep-test-2-proposal-data.js': '9875ad31448ee83e03a718db28e6c6b20ce45b03d96ee6ad3f7fdfec50993b1b',
    'reviews/test-1-study-guide-data.js': '93346b34ef2dd23988f9a82a9d8b3bdfcfdd240d34d26636814626fbbe81c22c'
};

test('all report content and grading datasets survive the style migration', () => {
    const reportFiles = fs.readdirSync(path.join(root, 'reviews')).filter(file => file.endsWith('.html'))
        .map(file => 'reviews/' + file).concat('scores/practice-quiz-c-grade-report.html');
    assert.deepEqual(reportFiles.sort(), Object.keys(originals).sort(), 'Every report is covered');
    for (const [file, expected] of Object.entries(originals)) {
        const html = fs.readFileSync(path.join(root, file), 'utf8');
        const text = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1]
            .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<summary class="report-context__label">[\s\S]*?<\/summary>/gi, '')
            .replace(/<a\b[^>]*class="(?:back-link|back)"[^>]*>[\s\S]*?<\/a>/gi, '')
            .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        assert.equal(hash(text), expected, file + ': all original report text is retained');
        assert.match(html, /<body class="mcm-report">/);
        assert.match(html, /href="\.\.\/shared\/styles.css"/);
        assert.match(html, /href="\.\.\/shared\/reports.css"/);
        assert.doesNotMatch(html, /#1a1a2e|#222240|#b5b0ff|#7c6fff/i);
        for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
            if (/^(?:https?:|data:|#)/.test(target)) continue;
            assert.ok(fs.existsSync(path.resolve(root, path.dirname(file), target.split(/[?#]/)[0])),
                file + ': missing dependency ' + target);
        }
        for (const [, script] of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
            if (script.trim()) new Function(script);
        }
    }
    for (const [file, expected] of Object.entries(dataOriginals)) {
        assert.equal(hash(fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n')), expected,
            file + ': original answers, points, notes and evidence metadata must not change');
    }
});
