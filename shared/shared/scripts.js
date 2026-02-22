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

    // For keyword-type answers, check if user's answer contains the keyword
    var keywords = ['initial', 'burn', 'constant', 'per', 'base', 'multiply', 'decay',
        'cubic', 'quadratic', 'square', 'absolute', 'reciprocal', '1/x', 'noreal'];
    for (var i = 0; i < keywords.length; i++) {
        if (c.includes(keywords[i])) {
            return u.includes(keywords[i]);
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
        // Remove any previous scorecard/standards grid from prior submission
        var oldCard = result.parentNode.querySelector('.score-card');
        if (oldCard) oldCard.remove();
        var oldGrid = result.parentNode.querySelector('.standards-grid');
        if (oldGrid) oldGrid.remove();

        // Voice copy per .scorecard-spec.md and .voice-guide.md
        var line1, line2, passing;
        if (pct >= 95) { line1 = '🔥 Nothing but net.'; line2 = 'You own this unit.'; passing = true; }
        else if (pct >= 90) { line1 = '💪 Clean.'; line2 = 'Small gaps. Let\'s close them.'; passing = true; }
        else if (pct >= 80) { line1 = 'Solid work.'; line2 = 'A few to revisit. See below.'; passing = false; }
        else if (pct >= 70) { line1 = '📈 Getting there.'; line2 = 'Run it again. You\'ll climb.'; passing = false; }
        else if (pct >= 60) { line1 = 'Not there yet.'; line2 = 'Focus on the reds. One at a time.'; passing = false; }
        else { line1 = 'Tough round.'; line2 = 'Start with the hints. Build back up.'; passing = false; }

        var streakHtml = maxStreak >= 3
            ? '<div class="streak-badge">Best streak: <span class="streak-number">' + maxStreak + '</span> 🔥</div>'
            : '';

        var cardClass = passing ? 'score-card passing' : 'score-card needs-work';
        var cardHtml = '<div class="' + cardClass + '">' +
            '<div class="score-number">' + score + ' / ' + total + '</div>' +
            '<div class="score-pct">' + pct + '%</div>' +
            '<div class="score-message">' + line1 + '<br>' + line2 + '</div>' +
            streakHtml + '</div>';

        // Keep legacy result div for backward compat, hide it
        result.className = 'result show ' + (pct >= 70 ? 'correct' : 'incorrect');
        result.style.display = 'none';
        result.innerHTML = score + '/' + total + ' (' + pct + '%)';

        // Insert scorecard after result div
        result.insertAdjacentHTML('afterend', cardHtml);
        window.scrollTo({ top: result.parentNode.querySelector('.score-card').offsetTop - 20, behavior: 'smooth' });
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
        var cardsHtml = '<div class="standards-grid"><h3 class="standards-heading">STANDARDS</h3>';
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
                '<div class="standard-pct">' + sp + '%</div>' +
                '<div class="standard-copy">' + copy + '</div></div>';
        });
        cardsHtml += '</div>';
        var scoreCard = result.parentNode.querySelector('.score-card');
        if (scoreCard) scoreCard.insertAdjacentHTML('afterend', cardsHtml);
        else if (result) result.insertAdjacentHTML('afterend', cardsHtml);
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

/* === Countdown Timer === */

/**
 * Initialize a countdown timer. Reads data-time-minutes from .test-header.
 * ADHD-aware: shows remaining time, motivational toasts, auto-submits at 0.
 * @param {Object} [opts]
 * @param {number} [opts.minutes] - Override time in minutes
 * @param {Function} [opts.onTimeUp] - Callback when timer reaches 0
 */
function initTimer(opts) {
    opts = opts || {};
    var header = document.querySelector('[data-time-minutes]');
    var minutes = opts.minutes || (header ? parseInt(header.getAttribute('data-time-minutes')) : 0);
    if (!minutes) return null;

    var totalSeconds = minutes * 60;
    var remaining = totalSeconds;
    var timerEl = document.getElementById('timer');
    var valueEl = document.getElementById('timer-value');
    if (!timerEl || !valueEl) {
        // Auto-create timer in header subtitle area
        var subtitle = document.querySelector('.subtitle');
        if (subtitle) {
            var timer = document.createElement('div');
            timer.id = 'timer';
            timer.className = 'timer';
            timer.setAttribute('role', 'timer');
            timer.setAttribute('aria-live', 'off');
            timer.setAttribute('aria-label', 'Time remaining');
            timer.innerHTML = '<span class="timer-icon">⏱</span> <span class="timer-value" id="timer-value"></span>';
            subtitle.style.display = 'flex';
            subtitle.style.justifyContent = 'space-between';
            subtitle.style.alignItems = 'center';
            subtitle.appendChild(timer);
            timerEl = timer;
            valueEl = document.getElementById('timer-value');
        } else return null;
    }

    var toastsFired = {};

    function formatTime(s) {
        var m = Math.floor(s / 60);
        var sec = s % 60;
        return m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    function showToast(msg) {
        var toast = document.createElement('div');
        toast.className = 'timer-toast';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.textContent = '⏱ ' + msg;
        document.body.appendChild(toast);
        setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 3000);
    }

    function tick() {
        if (remaining <= 0) {
            valueEl.textContent = 'TIME';
            timerEl.className = 'timer times-up urgent';
            showToast("Time. Let's see where you are.");
            if (opts.onTimeUp) opts.onTimeUp();
            return;
        }

        remaining--;
        valueEl.textContent = formatTime(remaining);

        // State classes
        var mins = remaining / 60;
        if (mins <= 1) {
            timerEl.className = 'timer urgent';
            if (remaining % 15 === 0) timerEl.classList.add('pulse');
            else timerEl.classList.remove('pulse');
        } else if (mins <= 5) {
            timerEl.className = 'timer urgent';
            if (remaining % 60 === 0) timerEl.classList.add('pulse');
            else timerEl.classList.remove('pulse');
        } else if (mins <= 10) {
            timerEl.className = 'timer warning';
        } else {
            timerEl.className = 'timer';
        }

        // Toasts
        if (remaining === 600 && !toastsFired[600]) { toastsFired[600] = true; showToast('10 min. Stay locked in.'); }
        if (remaining === 300 && !toastsFired[300]) { toastsFired[300] = true; showToast('5 min. Finish strong.'); }
        if (remaining === 60 && !toastsFired[60]) { toastsFired[60] = true; showToast('60 seconds. Wrap it up.'); }

        setTimeout(tick, 1000);
    }

    valueEl.textContent = formatTime(remaining);
    setTimeout(tick, 1000);
    return { getRemaining: function() { return remaining; } };
}

/* === Arena Mode (Dark Theme) === */

(function() {
    // Restore preference on load
    var stored = localStorage.getItem('mcm-arena-mode');
    if (stored === 'on') {
        document.body.classList.add('arena-mode');
    } else if (stored === null) {
        // Auto-enable if OS prefers dark
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('arena-mode');
        }
    }

    // Insert toggle button if header exists
    document.addEventListener('DOMContentLoaded', function() {
        var header = document.querySelector('header');
        if (!header) return;
        header.style.position = 'relative';
        var btn = document.createElement('button');
        btn.className = 'arena-toggle';
        btn.id = 'arenaToggle';
        btn.setAttribute('aria-label', 'Toggle dark mode');
        btn.title = 'Arena Mode (Dark/Light)';
        btn.textContent = '🏀'; // basketball — Arena Mode toggle
        btn.onclick = function() {
            document.body.classList.toggle('arena-mode');
            var isArena = document.body.classList.contains('arena-mode');
            localStorage.setItem('mcm-arena-mode', isArena ? 'on' : 'off');
        };
        header.appendChild(btn);
    });
})();

/* === Shared Navigation (FD review C3) === */
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        var header = document.querySelector('header');
        if (!header) return;
        // Don't add back link on the dashboard itself
        var path = window.location.pathname;
        if (path.endsWith('index.html') || path.endsWith('/')) return;
        // Skip if page already has a back link in the header
        if (header.querySelector('a[href*="index"]')) return;
        var back = document.createElement('a');
        back.href = 'index.html';
        back.className = 'nav-back';
        back.textContent = '← Dashboard';
        back.setAttribute('aria-label', 'Back to Dashboard');
        header.insertBefore(back, header.firstChild);
    });
})();

/* === Countdown Timer (.timer-spec.md) === */

/**
 * Optional countdown timer. Opt-in: add data-time-minutes="45" to any
 * element with class "test-header" (or the <header>).
 * Timer shows remaining time (ADHD-friendly). Auto-submits at 0:00.
 */
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        var header = document.querySelector('[data-time-minutes]');
        if (!header) return;
        var minutes = parseInt(header.getAttribute('data-time-minutes'));
        if (!minutes || minutes <= 0) return;

        var remaining = minutes * 60;
        var toastFired = {};

        // Create timer element
        var timerEl = document.createElement('div');
        timerEl.className = 'timer';
        timerEl.id = 'timer';
        timerEl.setAttribute('role', 'timer');
        timerEl.setAttribute('aria-live', 'off');
        timerEl.setAttribute('aria-label', 'Time remaining');
        timerEl.innerHTML = '<span class="timer-icon">⏱</span><span class="timer-value" id="timer-value">' + formatTime(remaining) + '</span>';

        // Insert into header subtitle line or after header
        var subtitle = header.querySelector('.subtitle');
        if (subtitle) {
            subtitle.style.display = 'flex';
            subtitle.style.justifyContent = 'space-between';
            subtitle.style.alignItems = 'center';
            subtitle.appendChild(timerEl);
        } else {
            header.appendChild(timerEl);
        }

        var intervalId = setInterval(tick, 1000);

        function tick() {
            remaining--;
            if (remaining <= 0) {
                remaining = 0;
                clearInterval(intervalId);
                timerEl.className = 'timer times-up';
                document.getElementById('timer-value').textContent = 'TIME';
                showToast('Time. Let\'s see where you are.');
                // Auto-submit
                var submitBtn = document.querySelector('.submit-btn');
                if (submitBtn) submitBtn.click();
                return;
            }

            document.getElementById('timer-value').textContent = formatTime(remaining);

            // State classes
            if (remaining <= 300) timerEl.className = 'timer urgent';
            else if (remaining <= 600) timerEl.className = 'timer warning';
            else timerEl.className = 'timer';

            // Pulse: every 60s when urgent, every 15s in final minute
            if (remaining < 60 && remaining % 15 === 0) {
                timerEl.classList.add('pulse');
                setTimeout(function() { timerEl.classList.remove('pulse'); }, 300);
            } else if (remaining < 300 && remaining % 60 === 0) {
                timerEl.classList.add('pulse');
                setTimeout(function() { timerEl.classList.remove('pulse'); }, 300);
            }

            // Toast notifications (fire once each)
            if (remaining === 600 && !toastFired[600]) { toastFired[600] = true; showToast('10 min. Stay locked in.'); }
            if (remaining === 300 && !toastFired[300]) { toastFired[300] = true; showToast('5 min. Finish strong.'); }
            if (remaining === 60 && !toastFired[60]) { toastFired[60] = true; showToast('60 seconds. Wrap it up.'); }
        }

        function formatTime(s) {
            var m = Math.floor(s / 60);
            var sec = s % 60;
            return m + ':' + (sec < 10 ? '0' : '') + sec;
        }

        function showToast(msg) {
            var toast = document.createElement('div');
            toast.className = 'timer-toast';
            toast.setAttribute('role', 'alert');
            toast.setAttribute('aria-live', 'assertive');
            toast.textContent = '⏱ ' + msg;
            document.body.appendChild(toast);
            setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 3200);
        }
    });
})();


