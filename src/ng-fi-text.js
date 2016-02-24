angular.module('ng-fi-text', [])
  .directive('ngFiText', ['$window', function ($window) {
    "use strict";

    return {
      restrict: 'A',
      scope: {ngFiText: '@'},
      link: function postLink(scope, element, attrs) {
        if (!window.jQuery) {
          console.error('ng-fi-text needs jQuery to work. Sory :(');
          return;
        }

        // Internal Options
        var tolerance = 3;
        var fontSize = 10;
        var loopLimiter = 25; // higher is more accurate but increases process. Min 5~6

        var executionOdometer = 0;

        // Creating the element
        var textElem = angular.element('<div />').attr('style',
          'line-height: normal;' +
          'margin: 0px;' +
          'padding: 0px;'+
          'position: absolute;' +
          'text-align:center;' +
          'left:0px;' +
          'top: 0px;' +
          'word-break: normal;' +
          'word-wrap: normal;' +
          'white-space: nowrap;'
        );
        element.html(textElem);

        function contentFilling(callback) {

          var text = attrs.ngFiText || element.html() || '';
          textElem.html(text);

          if (callback)
            callback();

        } // contentFilling

        function executeMagic() {
          onStarted();

          executionOdometer++;

          var elementParent = textElem.parent();
          var elemParentHeight = elementParent.height();
          var elemParentWidth = elementParent.width();

          var elemHeight;
          var elemWidth;
          var heightDiff;
          var widthDiff;
          var diff;

          var baseCorrection = 10;
          var definitiveCorrection;

          var direction;
          var prevDirection = false;

          var currLoop = 1;
          var currXLoop = 0;
          var correctionMultiplier = 1;

          var newFontSize = fontSize;

          var maxSize = null;
          var minSize = 1;

          function grossCorrection(executionNumber) {
            if (currLoop > loopLimiter) {
              onFinished(newFontSize);
              return;
            }

            textElem.css('font-size', newFontSize + 'px');

            window.setTimeout(function () {

              if (executionNumber !== executionOdometer) {
                return;
              }

              elemHeight = textElem.height();
              elemWidth = textElem.width();
              heightDiff = elemParentHeight - elemHeight;
              widthDiff = elemParentWidth - elemWidth;
              diff = widthDiff < 0 ? widthDiff : heightDiff;

              direction = diff >= 0 ? 1 : -1;

              if (prevDirection) {
                if (direction < 0 && (maxSize === null || maxSize > newFontSize)) {
                  maxSize = newFontSize;
                } else if (direction > 0 && (minSize === null || minSize < newFontSize)) {
                  minSize = newFontSize;
                }
              }

              if (prevDirection && prevDirection !== direction) {
                currXLoop++;
                correctionMultiplier = correctionMultiplier * ( 1 - 0.25 * currXLoop );
                correctionMultiplier = correctionMultiplier < 0.05 ? 0.05 : correctionMultiplier;
              }

              currLoop++;
              prevDirection = direction;
              definitiveCorrection = baseCorrection * correctionMultiplier * direction;
              newFontSize = newFontSize + definitiveCorrection;
              if (minSize !== null && newFontSize < minSize) {
                newFontSize = minSize;
              } else if (maxSize !== null && newFontSize > maxSize) {
                newFontSize = maxSize;
              }

              if (diff < 0 || diff > tolerance) {
                grossCorrection(executionOdometer);
              } else {
                onFinished(newFontSize);
              }
            }, 0);
          } // grossCorrection
          grossCorrection(executionOdometer);
        } // executeMagic

        function onStarted() {
          textElem.css('right', 'auto');
          textElem.css('bottom', 'auto');
          textElem.css('visibility', 'hidden');
        }

        function onFinished(finalFontSize) {
          textElem.css('right', '0px');
          textElem.css('bottom', '0px');
          textElem.css('visibility', 'visible');
        }

        function onResizeStarted() {
          textElem.css('visibility', 'hidden');
        }

        // window resizing responsivenes
        var timeoutHolder;
        angular.element($window).bind('resize', function () {
          window.clearTimeout(timeoutHolder);
          onResizeStarted();
          timeoutHolder = window.setTimeout(executeMagic, 150);

        });

        // update on values changing
        scope.$watchGroup(['ngFiText', 'ngFiTextHtml'], function (newValue, oldValue) {
          contentFilling(executeMagic);
        });

        // Staring the magic...
        contentFilling(executeMagic);
      }
    };
  }]);
