(function(root) {
    'use strict';

    function escape(value) {
        return String(value).replace(/[&<>"']/g, function(character) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
        });
    }

    function finite(value) {
        return typeof value === 'number' && Number.isFinite(value);
    }

    function result(record) {
        record = record || {};
        var points = finite(record.score) && finite(record.total) && record.total > 0;
        return {
            pct: finite(record.pct) ? record.pct : points ? Math.round(record.score / record.total * 100) : null,
            earned: points ? record.score : null,
            possible: points ? record.total : null
        };
    }

    function metadata(label, value) {
        return value === undefined || value === null || value === '' ? '' :
            '<div><dt>' + escape(label) + '</dt><dd>' + escape(value) + '</dd></div>';
    }

    function render(card) {
        var tag = card.href ? 'a' : 'article';
        var link = card.href ? ' href="' + escape(card.href) + '"' : '';
        if (card.href && card.newTab) link += ' target="_blank" rel="noopener"';
        var scored = finite(card.pct);
        var points = finite(card.earned) && finite(card.possible) && card.possible > 0;
        var details = metadata('Points', points ? card.earned + '/' + card.possible : null) +
            metadata('Possible points', !points && finite(card.possible) && card.possible > 0 ? card.possible : null) +
            metadata('Attempt', card.attempt) +
            metadata('Teacher grade', card.teacherGrade) +
            metadata('Teacher rubric', card.teacherRating) +
            metadata('Teacher standards', card.teacherStandards) +
            metadata('Questions', finite(card.questions) ? card.questions : null) +
            metadata('Duration', card.duration);
        return '<' + tag + link + ' class="activity-card" data-variant="' + escape(card.variant) + '">' +
            '<div class="activity-card__heading">' +
            '<h3 class="activity-card__title">' + escape(card.title) + '</h3>' +
            '<div class="activity-card__result">' +
            '<div class="activity-card__result-label sr-only">' + (scored ? 'Score' : 'Status') + '</div>' +
            '<div class="activity-card__score' + (scored ? '' : ' activity-card__score--status') + '"' +
            (card.scoreId ? ' id="' + escape(card.scoreId) + '"' : '') + '>' +
            escape(scored ? card.pct + '%' : card.status || 'No score recorded') + '</div>' +
            '</div></div><p class="activity-card__context"><span class="activity-card__kind">' + escape(card.kind) + '</span>' +
            (card.subject ? ' · <span class="activity-card__subject">' + escape(card.subject) + '</span>' : '') + '</p>' +
            (details ? '<dl class="activity-card__details">' + details + '</dl>' : '') +
            '<div class="activity-card__footer">' +
            (card.date ? '<div class="activity-card__date">' + escape(card.date) + '</div>' : '') +
            (card.note ? '<p class="activity-card__note">' + escape(card.note) + '</p>' : '') +
            (card.href ? '<span class="activity-card__action">' + escape(card.action || 'Open activity') +
                (card.newTab ? ' (new tab)' : '') + '</span>' : '') +
            '</div></' + tag + '>';
    }

    function subject(unit) {
        return {
            'spring-final': 'Algebra II',
            'spring-s5': 'S5 · Exponential Equations',
            'spring-s4': 'S4.a & S4.b · Rational Expressions',
            'spring-s1s2s3': 'S1 · S2 · S3 · Polynomials',
            'spring-logs': 'L.a–L.f · Logarithms',
            'spring-s1': 'S1.a & S1.b · Polynomials',
            'winter-final': 'Algebra II · Finals review',
            'nonlinear': 'Algebra II · Nonlinear functions'
        }[unit] || '';
    }

    function fromRecord(test, record, attempt, attemptLabel) {
        var score = result(attempt || record);
        var teacher = test.key.indexOf('school-') === 0 || test.key.indexOf('s1-quiz-') === 0;
        var review = /^(reviews|scores)\//.test(test.file || '');
        var grade = attempt && attempt.teacher_grade != null ? attempt.teacher_grade : test.teacherGrade;
        var rating = attempt && attempt.teacher_rating != null ? attempt.teacher_rating : test.teacherRating;
        var standards = attempt && attempt.teacher_standards;
        if (grade && /^\d+\/\d+$/.test(grade)) {
            rating = rating || grade;
            grade = null;
        }
        if (rating === grade) rating = null;
        var card = {
            variant: teacher ? 'teacher-result' : 'practice-result',
            kind: teacher ? (/assessment|unit test/i.test(test.name) ? 'Teacher assessment' : 'Teacher quiz') :
                test.homework ? 'Homework' : review ? 'Scan-based review' : 'Practice',
            title: test.name,
            href: test.file,
            subject: subject(test.unit),
            pct: score.pct,
            earned: score.earned,
            possible: score.possible,
            teacherGrade: grade,
            teacherRating: rating,
            teacherStandards: standards ? Object.keys(standards).map(function(key) {
                return key + ': ' + standards[key];
            }).join(' · ') : null,
            questions: test.questions,
            attempt: score.pct !== null ? attemptLabel : null,
            status: 'No score recorded',
            action: review || teacher ? 'View report' : 'Open practice'
        };
        if (attempt && attempt.timestamp) {
            var date = new Date(attempt.timestamp);
            if (Number.isNaN(date.getTime())) throw new Error('Invalid activity timestamp: ' + attempt.timestamp);
            card.date = 'Recorded ' + date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
        return card;
    }

    var api = { render: render, result: result, fromRecord: fromRecord };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.MCMActivityCards = api;
})(typeof window !== 'undefined' ? window : globalThis);
