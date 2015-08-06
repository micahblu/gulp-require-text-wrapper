# gulp-require-text-wrapper
Wraps HTML, JSON, CSS or Plain Text in an AMD module that can be consumed cross origin

## Use
This gulp task is useful when if you have html, text, css, or json resources on a cdn that you otherwise wouldn't be able to access due to cross origin policies.

## How it works
The gulp task will create an AMD define function which returns an object with a text attribute containing the resource as a string. __If it is json__ you will need to parse it once loaded.

## Sample Gulp Task

```js
var gulp = require('gulp'),
    requireTextWrapper = require('gulp-require-text-wrapper');
    
gulp.task('require-wrap-html', function() {
  return gulp.src('./src/scripts/**/*.html')
    .pipe(requireTextWrapper())
    .pipe(rename(function(path) {
      path.extname += ".js"; // required!
    }))
    .pipe(gulp.dest('./src/scripts/'));
});

```
## Use with Angular

Let's say you have a directive that needs to load a template from a remote cdn. Normally you would run into cross origin issues, since both angular's internal templateUrl property and requirejs's text plugin use xhr behind the scenes to load plain text resources.

By using this plugin you can wrap the resource as an AMD define function, require it as normal and access the resource via the return object's text property.

```js
// Given a remote baseUrl of 'https://somecdn.com/templates/'
// ! The code below assumes the gulp task has been run on your resources and pushed to the remote server in its expected location

define(function(require) {
  'use strict';

  var template = require('./service-option.html'), // the actual request will be for 'https://somecdn.com/templates/service-option.html.js'
      serviceOptionController = require('./service-option-controller');

  var serviceOptionDirective = function() {
    return {
      restrict: 'E',
      scope: {
        service: '=',
        provider: '='
      },
      template: template.text,
      link: function(scope, element, attrs) {

      },
      controller: serviceOptionController
    }
  };

  return serviceOptionDirective;
});

```
