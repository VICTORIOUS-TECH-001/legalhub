(function () {
  'use strict';

  const { level, semester } = document.body.dataset;
  const catalog = window.LEGALHUB_COURSE_CATALOG;
  const semesterNames = { first: 'First Semester', second: 'Second Semester' };
  const levels = ['100L', '200L', '300L', '400L', '500L'];

  if (!levels.includes(level) || !semesterNames[semester]) {
    throw new Error('The course dashboard requires a valid level and semester.');
  }

  const courses = catalog[level]?.[semester];
  if (!Array.isArray(courses)) {
    throw new Error(`No course catalog exists for ${level} ${semesterNames[semester]}.`);
  }

  const semesterLabel = semesterNames[semester];
  const libraryUrl = `./pdf.html?level=${encodeURIComponent(level)}&semester=${encodeURIComponent(semester)}`;
  document.title = `Legal Hub — ${level} ${semesterLabel}`;
  document.body.classList.toggle('level-200', level === '200L');
  document.getElementById('semester-kicker').textContent = `${level} / ${semesterLabel.toUpperCase()}`;
  document.getElementById('semester-description').textContent =
    `Your ${level} ${semesterLabel.toLowerCase()} courses, gathered in one focused study space. Pick a course and keep moving.`;
  document.getElementById('semester-materials-link').href = libraryUrl;
  document.getElementById('course-count').textContent = String(courses.length);
  document.getElementById('level-number').textContent = level;

  document.querySelectorAll('[data-semester-link]').forEach(link => {
    const targetSemester = link.dataset.semesterLink;
    link.href = `./${level.toLowerCase()}-${targetSemester}-semester.html`;
    if (targetSemester === semester) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  const coursesContainer = document.getElementById('courses');
  const courseCards = Array.from(coursesContainer.querySelectorAll('.course'));
  if (courseCards.length !== courses.length || courses.some((course, index) => courseCards[index].dataset.name !== course.name)) {
    throw new Error(`The HTML course list does not match the ${level} ${semesterLabel} catalog.`);
  }
  courseCards.forEach((card, index) => {
    const materialLink = card.querySelector('a[data-course-material]');
    if (!materialLink) throw new Error(`The ${courseCards[index].dataset.name} card is missing its material link.`);
    materialLink.href = `${libraryUrl}&course=${encodeURIComponent(courses[index].name)}`;
  });
  const row = document.getElementById('course-thumbnails');
  row.innerHTML = courses.map((course, index) => `
    <div class="thumb" data-jump="${escapeHtml(course.name)}">
      <div class="thumb-sq" style="background:${['#4a6cf7', '#ff9d5c', '#34c759', '#7c5cfc', '#ffd25c', '#5ac8fa'][index % 6]};">
        ${escapeHtml(course.code || `COURSE ${index + 1}`)}
      </div>
      <div class="thumb-label">${escapeHtml(course.name)}</div>
    </div>`).join('');

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }
})();
