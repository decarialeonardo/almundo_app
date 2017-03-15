(function() {
  angular
    .module('firstComp')
    .component('firstComp', {
      templateUrl: 'first-comp.html',
      controller: firstCompController,
      bindings: {
        hola: '@'
      }
  });

  function firstCompController() {
    var _self = this;
  }
})();
