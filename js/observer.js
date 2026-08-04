(function() {
  'use strict';

  function initObserver() {
    if (!('IntersectionObserver' in window)) {
      const chapters = document.querySelectorAll('.chapter');
      chapters.forEach(function(chapter, idx) {
        if (idx > 0) {
          chapter.classList.add('visible');
        }
      });
      
      const letterBodies = document.querySelectorAll('.letter-body');
      letterBodies.forEach(function(body) {
        body.classList.add('visible');
      });
      return;
    }

    var options = {
      root: null,
      threshold: 0.1
    };

    function onIntersection(entries) {
      entries.forEach(function(entry) {
        var element = entry.target;
        var type = element.dataset.reveal;
        
        if (entry.isIntersecting) {
          if (type === 'chapter') {
            element.classList.add('visible');
          } else if (type === 'line' || type === 'greeting') {
            element.classList.add('visible');
          } else if (type === 'letter-body') {
            var items = element.querySelectorAll('.letter-text, .signature');
            items.forEach(function(item, idx) {
              setTimeout(function() {
                item.classList.add('visible');
              }, idx * 100);
            });
          } else if (type === 'item') {
            var parent = element.parentElement;
            if (parent && !parent.classList.contains('items-revealed')) {
              parent.classList.add('items-revealed');
            }
            element.classList.add('visible');
          } else if (type === 'small-thing') {
            element.classList.add('visible');
          } else if (type === 'dream-item') {
            element.classList.add('visible');
          } else if (type === 'song-info') {
            element.classList.add('visible');
          } else if (type === 'miss-content') {
            element.classList.add('visible');
          }
        }
      });
    }

    var observer = new IntersectionObserver(onIntersection, options);

    var chapters = document.querySelectorAll('.chapter[data-reveal]');
    chapters.forEach(function(chapter) {
      observer.observe(chapter);
    });

    var lines = document.querySelectorAll('.letter-line, .greeting');
    lines.forEach(function(line) {
      line.dataset.reveal = 'line';
      observer.observe(line);
    });

    var letterBodies = document.querySelectorAll('.letter-body');
    letterBodies.forEach(function(body) {
      body.dataset.reveal = 'letter-body';
      observer.observe(body);
    });

    var smallThings = document.querySelectorAll('.small-thing');
    smallThings.forEach(function(item) {
      item.dataset.reveal = 'small-thing';
      observer.observe(item);
    });

    var dreams = document.querySelectorAll('.dream-item');
    dreams.forEach(function(dream) {
      dream.dataset.reveal = 'dream-item';
      observer.observe(dream);
    });

    var photoCaptions = document.querySelectorAll('.photo-caption');
    photoCaptions.forEach(function(caption) {
      caption.dataset.reveal = 'photo-caption';
      observer.observe(caption);
    });

    var songInfos = document.querySelectorAll('.song-info');
    songInfos.forEach(function(info) {
      info.dataset.reveal = 'song-info';
      observer.observe(info);
    });

    var missCards = document.querySelectorAll('.miss-card');
    missCards.forEach(function(card) {
      card.dataset.reveal = 'miss-content';
      observer.observe(card);
    });
  }

  document.addEventListener('DOMContentLoaded', initObserver);
})();