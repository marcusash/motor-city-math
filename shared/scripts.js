/* Motor City Math — Shared Scripts
 * Common functions used across all test files.
 * Answer key modal, save/load progress, print, textarea resize.
 */

/* === Answer Key Modal === */

/**
 * Show the answer key modal after password verification.
 * Each test file sets its own answer key HTML content.
 * @param {string} answerKeyHTML - The HTML content for the answer key
 * @param {Function} [onShow] - Optional callback after content is inserted (e.g., MathJax re-render)
 */
function showAnswerKey(answerKeyHTML, onShow) {
    const password = prompt("Enter password to view answer key:");
    if (password !== '121274') {
        alert('Incorrect password. Access denied.');
        return;
    }

    document.getElementById('answerKeyBody').innerHTML = answerKeyHTML;
    document.getElementById('answerKeyModal').style.display = 'block';

    if (typeof onShow === 'function') {
        onShow();
    }
}

function closeAnswerKey() {
    document.getElementById('answerKeyModal').style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('answerKeyModal');
    if (modal && event.target === modal) {
        closeAnswerKey();
    }
});

/* === Save / Load Progress === */

/**
 * Save all input/textarea values to localStorage.
 * @param {string} storageKey - The localStorage key for this test
 */
function saveResults(storageKey) {
    const formData = {};
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(function(input) {
        if (input.id) {
            formData[input.id] = input.value || input.textContent || '';
        }
    });

    const saveData = {
        timestamp: new Date().toISOString(),
        formData: formData
    };

    localStorage.setItem(storageKey, JSON.stringify(saveData));
    alert('Results saved successfully!');
}

/**
 * Load saved input/textarea values from localStorage.
 * @param {string} storageKey - The localStorage key for this test
 */
function loadResults(storageKey) {
    const saved = localStorage.getItem(storageKey);
    if (!saved) {
        alert('No saved results found.');
        return;
    }

    var saveData;
    try {
        saveData = JSON.parse(saved);
    } catch (e) {
        alert('Saved data is corrupted. Starting fresh.');
        return;
    }

    // Handle both old format (flat object) and new format (with timestamp)
    var formData = saveData.formData || saveData;
    var savedDate = saveData.timestamp
        ? new Date(saveData.timestamp).toLocaleString()
        : 'unknown date';

    if (confirm('Load results from ' + savedDate + '?')) {
        Object.keys(formData).forEach(function(id) {
            var element = document.getElementById(id);
            if (element) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.value = formData[id];
                } else {
                    element.textContent = formData[id];
                }
            }
        });
        alert('Results loaded successfully!');
    }
}

/* === Print === */

function printTest() {
    window.print();
}

/* === Textarea Custom Resize === */

function initTextareaResize() {
    var textareas = document.querySelectorAll('textarea');
    textareas.forEach(function(textarea) {
        textarea.style.resize = 'none';

        var resizeHandle = document.createElement('div');
        resizeHandle.className = 'custom-resize-handle';
        resizeHandle.innerHTML = '⋰';

        var wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        wrapper.style.width = '100%';
        textarea.parentNode.insertBefore(wrapper, textarea);
        wrapper.appendChild(textarea);
        wrapper.appendChild(resizeHandle);

        var startY, startHeight;
        resizeHandle.addEventListener('mousedown', function(e) {
            startY = e.clientY;
            startHeight = parseInt(window.getComputedStyle(textarea).height, 10);
            document.addEventListener('mousemove', doResize);
            document.addEventListener('mouseup', stopResize);
            e.preventDefault();
        });

        function doResize(e) {
            textarea.style.height = (startHeight + e.clientY - startY) + 'px';
        }

        function stopResize() {
            document.removeEventListener('mousemove', doResize);
            document.removeEventListener('mouseup', stopResize);
        }
    });
}

/* === Auto-Grading Utilities === */

/**
 * Normalize a string for comparison: lowercase, strip whitespace and special chars.
 */
function norm(a) {
    if (typeof a !== 'string') return a;
    // Superscript → caret notation: x¹¹ → x^11
    var supers = {'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-'};
    var s = a;
    var superRe = /[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g;
    s = s.replace(superRe, function(m) {
        return '^' + m.split('').map(function(c){ return supers[c] || c; }).join('');
    });
    return s.toLowerCase().replace(/\s+|\*|\$|\{|\}/g, '');
}

/**
 * Check a student answer against the correct answer.
 * Numeric answers use tolerance; string answers use normalization.
 * @param {string} userAnswer - The student's input
 * @param {string|number} correctAnswer - The expected answer
 * @param {number} [tolerance=0.5] - Numeric tolerance for number answers
 * @returns {boolean}
 */
function checkAnswer(userAnswer, correctAnswer, tolerance) {
    if (tolerance === undefined) tolerance = 0.5;

    if (typeof correctAnswer === 'number') {
        var cleaned = String(userAnswer).replace(/[$,]/g, '');
        return Math.abs(parseFloat(cleaned) - correctAnswer) <= tolerance;
    }

    var u = norm(userAnswer);
    var c = norm(correctAnswer);

    // For keyword-type answers, check if the user's answer contains the key prefix
    var keywords = ['initial', 'burn', 'constant', 'per', 'base', 'multiply', 'decay',
        'cubic', 'quadratic', 'square', 'absolute', 'reciprocal', '1/x', 'noreal'];
    for (var i = 0; i < keywords.length; i++) {
        if (c.includes(keywords[i])) {
            return u.includes(c.substring(0, 4));
        }
    }

    return u === c;
}

/* === Auto-Grading Engine === */

/**
 * Grade a test: check each answer, show per-question feedback, display final score.
 *
 * @param {Object} config
 * @param {Array} config.questions - Array of [parts, feedbackId]
 *   parts = [[elementId, correctAnswer, tolerance?], ...]
 * @param {Array} config.feedbacks - 2D array: feedbacks[i] = [correct1, incorrect1, correct2, incorrect2, ...]
 * @param {string} [config.resultId='finalResult'] - Element ID for score display
 * @param {string} [config.storageKey] - localStorage key to persist score for dashboard
 * @param {Array} [config.standards] - Optional per-question standard tags: [{id:'1.a', name:'Simplify'}, ...]
 * @returns {Object} { score, total, pct, streak, standardScores }
 */
function gradeTest(config) {
    var questions = config.questions;
    var feedbacks = config.feedbacks;
    var resultId = config.resultId || 'finalResult';
    var standards = config.standards || [];
    var score = 0, total = 0;
    var streak = 0, maxStreak = 0;
    var stdScores = {}; // {id: {name, correct, total}}

    questions.forEach(function(q, i) {
        var txt = '', correct = 0;
        var parts = q[0];
        var feedbackId = q[1];
        var std = standards[i];
        if (std && std.id && !stdScores[std.id]) {
            stdScores[std.id] = { name: std.name || std.id, correct: 0, total: 0 };
        }

        parts.forEach(function(p, j) {
            total++;
            var element = document.getElementById(p[0]);
            if (!element) return;
            var val = element.value || element.textContent || '';
            var isCorrect = checkAnswer(val, p[1], p[2] || 0.5);
            if (std && std.id) stdScores[std.id].total++;
            if (isCorrect) {
                score++;
                correct++;
                streak++;
                if (streak > maxStreak) maxStreak = streak;
                if (std && std.id) stdScores[std.id].correct++;
                txt += feedbacks[i][j * 2] + '\n';
            } else {
                streak = 0;
                txt += feedbacks[i][j * 2 + 1] + '\n';
            }
        });

        var fb = document.getElementById(feedbackId);
        if (fb) {
            fb.className = 'answer-feedback show ' + (correct === parts.length ? 'correct' : 'incorrect');
            fb.textContent = txt;
        }
    });

    var pct = Math.round((score / total) * 100);
    var result = document.getElementById(resultId);
    if (result) {
        // Voice guide: celebrate results, not effort. Max 12 words.
        var msg;
        if (pct >= 90) msg = '🔥 ' + score + '/' + total + '. Locked in.';
        else if (pct >= 80) msg = score + '/' + total + '. Close. One more pass.';
        else if (pct >= 70) msg = score + '/' + total + '. Getting there. Keep pushing.';
        else msg = score + '/' + total + '. Needs work. Run it again.';

        var streakHtml = maxStreak >= 3
            ? '<div class="streak-badge">Best streak: <span class="streak-number">' + maxStreak + '</span> 🔥</div>'
            : '';

        result.className = 'result show ' + (pct >= 70 ? 'correct' : 'incorrect');
        result.innerHTML = '<div>Done. ' + total + '/' + total + ' answered.</div>' +
            '<div>' + msg + ' (' + pct + '%)</div>' + streakHtml;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Render per-standard breakdown if standards were provided
    var stdKeys = Object.keys(stdScores);
    if (stdKeys.length > 0) {
        // Sort lowest score first (focus areas on top)
        stdKeys.sort(function(a, b) {
            var pa = stdScores[a].total ? (stdScores[a].correct / stdScores[a].total) : 0;
            var pb = stdScores[b].total ? (stdScores[b].correct / stdScores[b].total) : 0;
            return pa - pb;
        });
        var cardsHtml = '<div class="standards-grid"><h3 class="standards-heading">Standards Breakdown</h3>';
        stdKeys.forEach(function(id) {
            var s = stdScores[id];
            var sp = s.total ? Math.round((s.correct / s.total) * 100) : 0;
            var color = sp >= 90 ? '#1B7D3A' : sp >= 70 ? '#1D42BA' : sp >= 50 ? '#E8A317' : '#C8102E';
            var copy = sp >= 90 ? 'Locked in ✅' : sp >= 70 ? 'Solid.' : sp >= 50 ? 'Getting there.' : '⚠️ Needs work.';
            cardsHtml += '<div class="standard-card" style="border-left-color:' + color + '">' +
                '<div class="standard-header"><span class="standard-id">' + id + '</span>' +
                '<span class="standard-name">' + s.name + '</span>' +
                '<span class="standard-fraction">' + s.correct + '/' + s.total + '</span></div>' +
                '<div class="standard-bar"><div class="standard-fill" style="width:' + sp + '%;background:' + color + '"></div></div>' +
                '<div class="standard-copy">' + copy + '</div></div>';
        });
        cardsHtml += '</div>';
        var resultEl = document.getElementById(resultId);
        if (resultEl) resultEl.insertAdjacentHTML('afterend', cardsHtml);
    }

    // Save score for dashboard
    if (config.storageKey) {
        var scores = {};
        try {
            scores = JSON.parse(localStorage.getItem('mcm_scores') || '{}');
        } catch (e) { scores = {}; }
        scores[config.storageKey] = {
            score: score,
            total: total,
            pct: pct,
            streak: maxStreak,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('mcm_scores', JSON.stringify(scores));
    }

    return { score: score, total: total, pct: pct, streak: maxStreak, standardScores: stdScores };
}
