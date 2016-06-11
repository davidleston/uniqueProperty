'use strict';

describe('uniqueProperty directive', function () {

  var html = '\
    <form name="form"> \
      <input name="nameInput"\
             ng-model="entity.name" \
             unique-property \
             unique-property-object="entity" \
             unique-property-collection="collection" \
             unique-property-path="{{propertyPath}}"> \
    </form>';

  beforeEach(module('davidLeston.uniqueProperty'));

  it('duplicate name', inject(function ($compile, $rootScope){
    $rootScope.entity = {name: 'name'};
    $rootScope.collection = [$rootScope.entity, {name: 'name'}];
    $rootScope.propertyPath = 'name';
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$error.uniqueProperty).to.be.true;
  }));

  it('duplicate name object', inject(function ($compile, $rootScope){
    $rootScope.entity = {name: 'name'};
    $rootScope.collection = {a: $rootScope.entity, b: {name: 'name'}};
    $rootScope.propertyPath = 'name';
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$error.uniqueProperty).to.be.true;
  }));

  it('empty collection', inject(function ($compile, $rootScope){
    $rootScope.entity = {name: 'name'};
    $rootScope.collection = [];
    $rootScope.propertyPath = 'name';
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
  }));

  it('empty object', inject(function ($compile, $rootScope){
    $rootScope.entity = {name: 'name'};
    $rootScope.collection = {};
    $rootScope.propertyPath = 'name';
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
  }));

  it('nil collection', inject(function ($compile, $rootScope){
    $rootScope.entity = {name: 'name'};
    $rootScope.collection = undefined;
    $rootScope.propertyPath = 'name';
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
  }));

  it('nil object', inject(function ($compile, $rootScope){
    $rootScope.entity = undefined;
    $rootScope.collection = [];
    $rootScope.propertyPath = 'name';
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
  }));

  it('nil property path', inject(function ($compile, $rootScope){
    $rootScope.entity = {name: 'name'};
    $rootScope.collection = [$rootScope.entity];
    $rootScope.propertyPath = undefined;
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
  }));

  it('two undefineds are dupes', inject(function ($compile, $rootScope){
    $rootScope.entity = {};
    $rootScope.collection = [$rootScope.entity, {}];
    $rootScope.propertyPath = 'name';
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$error.uniqueProperty).to.be.true;
  }));

  it('Changing entity creates invalid', inject(function ($compile, $rootScope){
    $rootScope.entity = {name: 'a'};
    var secondEntity = {name: 'b'}
    $rootScope.collection = [$rootScope.entity, secondEntity];
    $rootScope.propertyPath = 'name';
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
    $rootScope.entity.name = secondEntity.name;
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$error.uniqueProperty).to.be.true;
  }));

  it('Changing another element in collection creates invalid', inject(function ($compile, $rootScope){
    $rootScope.entity = {name: 'a'};
    var secondEntity = {name: 'b'}
    $rootScope.collection = [$rootScope.entity, secondEntity];
    $rootScope.propertyPath = 'name';
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
    secondEntity.name = $rootScope.entity.name;
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$error.uniqueProperty).to.be.true;
  }));

  it('Changing another element in collection (object) creates invalid', inject(function ($compile, $rootScope){
    $rootScope.entity = {name: 'a'};
    var secondEntity = {name: 'b'}
    $rootScope.collection = {a: $rootScope.entity, b: secondEntity};
    $rootScope.propertyPath = 'name';
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
    secondEntity.name = $rootScope.entity.name;
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$error.uniqueProperty).to.be.true;
  }));

  it('Changing collection membership creates invalid', inject(function ($compile, $rootScope){
    $rootScope.entity = {name: 'a'};
    $rootScope.collection = [$rootScope.entity];
    $rootScope.propertyPath = 'name';
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
    $rootScope.collection.push({name: 'a'});
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$error.uniqueProperty).to.be.true;
  }));

  it('Changing collection (object) membership creates invalid', inject(function ($compile, $rootScope){
    $rootScope.entity = {name: 'a'};
    $rootScope.collection = {a: $rootScope.entity};
    $rootScope.propertyPath = 'name';
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
    $rootScope.collection.b = {name: 'a'};
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$error.uniqueProperty).to.be.true;
  }));

  it('Changing element no longer in collection does not create invalid', inject(function ($compile, $rootScope){
    $rootScope.entity = {name: 'a'};
    $rootScope.collection = [{name: 'b'}, $rootScope.entity];
    $rootScope.propertyPath = 'name';
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
    var other = $rootScope.collection.shift();
    other.name = $rootScope.entity.name;
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
  }));

  it('Changing element no longer in collection (object) does not create invalid', inject(function ($compile, $rootScope){
    $rootScope.entity = {name: 'a'};
    $rootScope.collection = {b: {name: 'b'}, a: $rootScope.entity};
    $rootScope.propertyPath = 'name';
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
    var other = $rootScope.collection.b;
    delete $rootScope.collection.b;
    other.name = $rootScope.entity.name;
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
  }));

  it('Changing old collection does not create invalid', inject(function ($compile, $rootScope){
    $rootScope.entity = {name: 'a'};
    var other = {name: 'b'};
    $rootScope.collection = [other, $rootScope.entity];
    $rootScope.propertyPath = 'name';
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
    $rootScope.collection = [$rootScope];
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
  }));

  it('Changing old collection (object) does not create invalid', inject(function ($compile, $rootScope){
    $rootScope.entity = {name: 'a'};
    var other = {name: 'b'};
    $rootScope.collection = {b: other, a: $rootScope.entity};
    $rootScope.propertyPath = 'name';
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
    $rootScope.collection = {a: $rootScope};
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
  }));

  it('Setting collection to new collection creates invalid', inject(function ($compile, $rootScope){
    $rootScope.entity = {name: 'a'};
    $rootScope.collection = [$rootScope.entity];
    $rootScope.propertyPath = 'name';
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
    $rootScope.collection = [$rootScope.collection, {name: 'a'}];
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$error.uniqueProperty).to.be.true;
  }));

  it('Setting collection (object) to new collection creates invalid', inject(function ($compile, $rootScope){
    $rootScope.entity = {name: 'a'};
    $rootScope.collection = {a: $rootScope.entity};
    $rootScope.propertyPath = 'name';
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
    $rootScope.collection = {a: $rootScope.collection, b: {name: 'a'}};
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$error.uniqueProperty).to.be.true;
  }));

  it('Changing property path creates invalid', inject(function ($compile, $rootScope){
    $rootScope.entity = {name: 'a', unique: 1};
    $rootScope.collection = [$rootScope.entity, {name: 'a', unique: 2}];
    $rootScope.propertyPath = 'unique';
    $compile(html)($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$invalid).to.be.false;
    $rootScope.propertyPath = 'name';
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$error.uniqueProperty).to.be.true;
  }));

  it('deep paths', inject(function ($compile, $rootScope){
    $rootScope.entity = {name: {first: 'c'}};
    $rootScope.collection = [$rootScope.entity, _.cloneDeep($rootScope.entity)];
    $rootScope.propertyPath = 'name.first';
    $compile('<form name="form"> \
        <input name="nameInput"\
               ng-model="entity.name.first" \
               unique-property \
               unique-property-object="entity" \
               unique-property-collection="collection" \
               unique-property-path="{{propertyPath}}"> \
      </form>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.form.nameInput.$error.uniqueProperty).to.be.true;
  }));
});
