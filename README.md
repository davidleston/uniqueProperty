Angular Unique Property Validator
=================================

[![Build Status](https://travis-ci.org/davidleston/uniqueProperty.svg?branch=master)](https://travis-ci.org/davidleston/uniqueProperty)
![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)

Validates that an object has a unique value of a property amongst a collection of objects. For example, imagine your application manages a list of friends. You want to ensure you don't accidentally enter the same friend twice. To validate that an input field does not contain the same name as another friend you would do the following:

```html
<input
  ng-model="friend.name"
  unique-property
  unique-property-object="friend"
  unique-property-collection="friends"
  unique-property-path="name">
```

When the input field contains the same name as any of the other friends the field will be marked invalid.

Unique property validation works with any element with an [`ng-model`](https://docs.angularjs.org/api/ng/directive/ngModel).

# Get Started

1. Install `bower install https://github.com/davidleston/uniqueProperty#1.0.0`
2. Include `davidLeston.uniqueProperty.js` (or `davidLeston.uniqueProperty.min.js`) in you `index.html`, after including Angular and lodash.
3. Add `davidLeston.uniqueProperty` to your main module's list of dependencies.

When you're done, your setup should look similar to the following:

```html
<!doctype html>
<html ng-app="myApp">
<body>
  ...
  <script src="angular.min.js"></script>
  <script src="lodash.min.js"></script>
  <script src="davidLeston.uniqueProperty.min.js"></script>
  ...
  <script>
    angular.module('myApp', ['davidLeston.uniqueProperty']);
  </script>
  ...
</body>
</html>
```

# Details

`unique-property-path` may contain any path that is supported by [lodash's toPath function](https://lodash.com/docs#toPath).

`unique-property-collection` may be an array or an object. If `unique-property-collection` is an object the object's values are used as the collection. Adding or removing properties to an object is tracked just as adding and removing elements from an array is tracked.

If `unique-property-object`, `unique-property-collection`, or `unique-property-path` are null or undefined the validator will not mark the field valid.

Validation will occur when:
* whenever the value bound using `ng-model` is attempted to be updated, see [`ng-model-options`](https://docs.angularjs.org/api/ng/directive/ngModelOptions)
* the value of the specified property on any element in the array changes
* elements are added or removed from the array assigned to `unique-property-collection`
* the value of `unique-property-object`, `unique-property-collection`, or `unique-property-path` changes

Validator has correct behavior if the `ng-model-options` parameter `allowInvalid` is set to `true`.
