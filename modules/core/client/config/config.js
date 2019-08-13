(function (window) {
  'use strict';

  var applicationModuleName = 'app';
  var service = {
    applicationEnvironment: "dev",
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: [
      'ngAnimate',
      'ngCookies',
      'ngResource',
      'ngSanitize',
      'ngTouch',
      'ngStorage',
      'ui.router',
      'ui.bootstrap',
      'ui.load',
      'ui.jq',
      'ui.validate',
      'oc.lazyLoad',
      'pascalprecht.translate'
    ],
    registerModule: registerModule
  };
  window.ApplicationConfiguration = service;

  // Add a new vertical module
  function registerModule(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  }

  // Angular-ui-notification configuration
  /*angular.module('ui-notification').config(function (NotificationProvider) {
    NotificationProvider.setOptions({
      delay: 2000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'bottom'
    });
  });*/
  console.log("gggggggggggggggggggggggggggggggggggggggg");
}(window));
