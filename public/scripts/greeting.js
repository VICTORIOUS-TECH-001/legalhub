(function () {
  'use strict';

  window.getNigeriaGreeting = function (date = new Date()) {
    const hour = Number(new Intl.DateTimeFormat('en-NG', {
      timeZone: 'Africa/Lagos',
      hour: 'numeric',
      hourCycle: 'h23'
    }).format(date));

    return hour >= 5 && hour < 12
      ? 'Good morning'
      : hour >= 12 && hour < 17
        ? 'Good afternoon'
        : 'Good evening';
  };
})();
