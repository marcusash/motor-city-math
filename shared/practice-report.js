/* Text-only practice reports share one renderer and keep scoring in their data files. */
(function () {
    'use strict';
    var data = window.practiceGradeReport;
    var root = document.getElementById('report');
    function element(tag, text, className) {
        var node = document.createElement(tag);
        if (text !== undefined) node.textContent = text;
        if (className) node.className = className;
        return node;
    }
    function sum(rows, key) {
        return rows.reduce(function (total, row) { return total + row[key]; }, 0);
    }
    function fail(message) {
        root.textContent = 'Report unavailable: ' + message;
        throw new Error(message);
    }
    function validAward(earned, points) {
        return Number.isFinite(earned) && Number.isFinite(points) &&
            points > 0 && earned >= 0 && earned <= points;
    }
    if (!data || !Array.isArray(data.questions) || !data.questions.length) {
        fail('Missing practice scoring data.');
    }
    var ids = new Set();
    data.questions.forEach(function (question) {
        if (ids.has(String(question.id)) || !validAward(question.earned, question.points) ||
            !Array.isArray(question.components) || !question.components.length ||
            question.components.some(function (component) {
                return !validAward(component.earned, component.points) || !component.reason;
            }) ||
            Math.abs(sum(question.components, 'earned') - question.earned) > 1e-9 ||
            Math.abs(sum(question.components, 'points') - question.points) > 1e-9) {
            fail('Inconsistent scoring for question ' + question.id + '.');
        }
        ids.add(String(question.id));
    });
    var earned = sum(data.questions, 'earned');
    var possible = sum(data.questions, 'points');
    if (earned !== data.earned || possible !== data.points) fail('Report totals do not match question awards.');
    document.title = data.title + ' - Practice Review';
    root.append(element('a', '\u2190 Back to Dashboard', 'back-link'));
    root.lastChild.href = '../index.html';
    var header = element('header', undefined, 'review-header');
    header.append(element('h1', data.title));
    header.append(element('p', 'Precalculus | Reviewed ' + data.reviewedOn +
        ' (Pacific) | Completion date and elapsed time unknown', 'meta'));
    root.append(header);
    var summary = element('section', undefined, 'summary-card');
    summary.append(element('h2', 'Practice score'));
    var score = element('div', String(earned), 'score-big');
    score.id = 'score';
    score.append(element('span', '/' + possible + ' (' + (earned / possible * 100).toFixed(1) + '%)', 'denom'));
    summary.append(score);
    summary.append(element('p', data.provenance));
    summary.append(element('p', 'Practice scoring, not teacher-awarded marks or an official course grade. ' +
        'Review dates are not completion dates; an exam allowance is not observed elapsed time.', 'note'));
    var actions = element('div', undefined, 'review-actions');
    var print = element('button', 'Print review');
    print.type = 'button';
    print.addEventListener('click', function () { window.print(); });
    actions.append(print);
    var pdf = element('a', 'Download PDF review');
    pdf.href = data.pdf;
    actions.append(pdf);
    summary.append(actions);
    root.append(summary);
    if (data.sections && data.sections.length) {
        var sectionIds = data.sections.flatMap(function (section) { return section.questionIds.map(String); });
        if (sectionIds.length !== ids.size || new Set(sectionIds).size !== ids.size ||
            sectionIds.some(function (id) { return !ids.has(id); })) fail('Section mapping is inconsistent.');
        var sections = element('div', undefined, 'standards-grid');
        data.sections.forEach(function (section) {
            var rows = data.questions.filter(function (q) { return section.questionIds.map(String).includes(String(q.id)); });
            var card = element('div', undefined, 'section-card');
            card.append(element('h2', section.title));
            card.append(element('div', sum(rows, 'earned') + '/' + sum(rows, 'points'), 'section-score'));
            sections.append(card);
        });
        root.append(sections);
    }
    root.append(element('h2', 'Question summary'));
    var tableWrap = element('div', undefined, 'table-wrap');
    tableWrap.setAttribute('role', 'region');
    tableWrap.setAttribute('aria-label', 'Question scores');
    tableWrap.tabIndex = 0;
    var table = element('table');
    var head = element('thead');
    var heading = element('tr');
    ['Question', 'Focus', 'Practice points'].forEach(function (label) {
        var th = element('th', label);
        th.scope = 'col';
        heading.append(th);
    });
    head.append(heading);
    table.append(head);
    var body = element('tbody');
    data.questions.forEach(function (q) {
        var row = element('tr');
        var label = element('th');
        label.scope = 'row';
        var link = element('a', 'Q' + q.id);
        link.href = '#question-' + q.id;
        label.append(link);
        row.append(label, element('td', q.title), element('td', q.earned + '/' + q.points, 'score-cell'));
        body.append(row);
    });
    table.append(body);
    tableWrap.append(table);
    root.append(tableWrap);
    data.questions.forEach(function (q) {
        var card = element('article', undefined, 'q-card ' + (q.earned === q.points ? 'correct' : q.earned ? 'partial' : 'incorrect'));
        card.id = 'question-' + q.id;
        card.append(element('h2', 'Q' + q.id + ': ' + q.title));
        card.append(element('p', q.earned + '/' + q.points + ' practice points', 'question-score'));
        if (q.problem) card.append(element('p', q.problem, 'q-problem'));
        if (q.answer) {
            card.append(element('h3', 'Recorded work'));
            card.append(element('p', q.answer));
        }
        card.append(element('h3', 'Worked answer'));
        (Array.isArray(q.solution) ? q.solution : [q.solution]).forEach(function (line) {
            if (line) card.append(element('p', line, 'answer-box'));
        });
        if (q.corrections) {
            ['keep', 'change', 'check'].forEach(function (key) {
                if (q.corrections[key]) {
                    var correction = element('p');
                    correction.append(element('strong', key[0].toUpperCase() + key.slice(1) + ': '));
                    correction.append(document.createTextNode(q.corrections[key]));
                    card.append(correction);
                }
            });
        } else if (q.result) card.append(element('p', q.result, 'coaching'));
        var details = element('details');
        details.open = true;
        details.append(element('summary', 'Scoring and partial-credit explanation'));
        var rubricWrap = element('div', undefined, 'table-wrap');
        rubricWrap.setAttribute('role', 'region');
        rubricWrap.setAttribute('aria-label', 'Question ' + q.id + ' scoring details');
        rubricWrap.tabIndex = 0;
        var rubric = element('table', undefined, 'rubric-table');
        var rubricHead = element('thead');
        var rubricHeading = element('tr');
        ['Component', 'Award', 'Reason'].forEach(function (text) {
            var th = element('th', text);
            th.scope = 'col';
            rubricHeading.append(th);
        });
        rubricHead.append(rubricHeading);
        rubric.append(rubricHead);
        var rubricBody = element('tbody');
        q.components.forEach(function (component, index) {
            var row = element('tr');
            row.append(element('td', component.rubric || 'Component ' + (index + 1)),
                element('td', component.earned + '/' + component.points, 'score-cell'),
                element('td', component.reason));
            rubricBody.append(row);
        });
        rubric.append(rubricBody);
        rubricWrap.append(rubric);
        details.append(rubricWrap);
        card.append(details);
        root.append(card);
    });
    var notes = element('section', undefined, 'notes-card');
    notes.append(element('h2', 'Scoring and source notes'));
    var list = element('ul');
    data.notes.forEach(function (note) { list.append(element('li', note)); });
    notes.append(list);
    (data.sources || []).forEach(function (source) {
        var url = new URL(source.url);
        if (url.protocol !== 'https:') fail('Invalid report source link.');
        var paragraph = element('p');
        var link = element('a', source.label);
        link.href = url.href;
        paragraph.append(link);
        notes.append(paragraph);
    });
    root.append(notes);
    if (typeof renderMathInElement !== 'function') fail('Math renderer did not load.');
    renderMathInElement(root, {
        delimiters: [{ left: '\\(', right: '\\)', display: false }, { left: '\\[', right: '\\]', display: true }],
        throwOnError: true, trust: false
    });
    var collapsed;
    window.addEventListener('beforeprint', function () {
        if (collapsed !== undefined) return;
        collapsed = Array.from(root.querySelectorAll('details')).filter(function (detail) { return !detail.open; });
        collapsed.forEach(function (detail) { detail.open = true; });
    });
    window.addEventListener('afterprint', function () {
        (collapsed || []).forEach(function (detail) { detail.open = false; });
        collapsed = undefined;
    });
}());
