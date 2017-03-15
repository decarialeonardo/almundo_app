(function() {
  angular
    .module('firstComp')
    .component('firstComp', {
      templateUrl: 'components/first-comp/first-comp.html',
      controller: firstCompController,
      bindings: {
        name: '@'
      }
  });

  function firstCompController() {
    var _self = this;
  }
})();
