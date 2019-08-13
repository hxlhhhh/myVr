'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {

          $urlRouterProvider
              .otherwise('/authentication/signin');
          $stateProvider
              .state('authentication', {
                  abstract: true,
                  url: '/authentication'
              })
              .state('authentication.signup', {
                  url: '/signup',
                  templateUrl: '/tpl/user/user.signup.html',
                  controller:'userCtrl',
                  controllerAs:'vm',
                  resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load([
                            '/js/controllers/user/userController.js',
                            '/js/services/user/user.client.service.js'
                        ]);
                      }]
                  }
              })
              .state('authentication.signin', {
                  url: '/signin',
                  templateUrl: '/tpl/user/user.signin.html',
                  controller:'userCtrl',
                  controllerAs:'vm',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load([
                                  '/js/controllers/user/userController.js',
                                  '/js/services/user/user.client.service.js'
                              ]);
                          }]
                  }
              })

              //在线考试
              .state('online',{
                  abstract: true,
                  url: '/online'
              })
              .state('online.examination',{
                  url:'/examination',
                  templateUrl: '/tpl/onlineexamination/onlineExamination.html',
                  controller:'onlineExaminationCtrl',
                  controllerAs:'vm',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load([
                                  '/js/controllers/onlineexamination/onlineExamination.js',
                                  '/js/services/onlineExamination/onlineExamination.client.service.js',
                              ]);
                          }]
                  },
                  params:{
                      'data':null
                  }
              })

              .state('app', {
                  abstract: true,
                  url: '/app',
                  templateUrl: '/tpl/app.html',
                  controller:'appController',
                  controllerAs:"vm",
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load(
                                  [
                                      '/js/controllers/app/appController.js',
                                      '/js/services/user/user.client.service.js',
                                      /*'/js/controllers/blocks/nav.js',*/
                                      '/js/services/blocks/nav.client.service.js',
                                  ]);
                          }]
                  }
              })
              .state('app.dashboard-v1', {
                  url: '/dashboard-v1',
                  templateUrl: '/tpl/app_dashboard_v1.html',
                  resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load(['/js/controllers/chart.js']);
                    }]
                  }
              })
              .state('app.dashboard-v2', {
                  url: '/dashboard-v2',
                  templateUrl: '/tpl/app_dashboard_v2.html',
                  resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load(['/js/controllers/chart.js']);
                    }]
                  }
              })
              //ui:
              .state('app.ui', {
                  url: '/ui',
                  template: '<div ui-view class="fade-in-up"></div>'
              })
              .state('app.ui.buttons', {
                  url: '/buttons',
                  templateUrl: 'tpl/ui_buttons.html'
              })
              .state('app.ui.icons', {
                  url: '/icons',
                  templateUrl: 'tpl/ui_icons.html'
              })
              .state('app.ui.grid', {
                  url: '/grid',
                  templateUrl: 'tpl/ui_grid.html'
              })
              .state('app.ui.widgets', {
                  url: '/widgets',
                  templateUrl: 'tpl/ui_widgets.html'
              })          
              .state('app.ui.bootstrap', {
                  url: '/bootstrap',
                  templateUrl: 'tpl/ui_bootstrap.html'
              })
              .state('app.ui.sortable', {
                  url: '/sortable',
                  templateUrl: 'tpl/ui_sortable.html'
              })
              .state('app.ui.portlet', {
                  url: '/portlet',
                  templateUrl: 'tpl/ui_portlet.html'
              })
              .state('app.ui.timeline', {
                  url: '/timeline',
                  templateUrl: 'tpl/ui_timeline.html'
              })
              .state('app.ui.tree', {
                  url: '/tree',
                  templateUrl: 'tpl/ui_tree.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('angularBootstrapNavTree').then(
                              function(){
                                 return $ocLazyLoad.load('/js/controllers/tree.js');
                              }
                          );
                        }
                      ]
                  }
              })
              .state('app.ui.toaster', {
                  url: '/toaster',
                  templateUrl: 'tpl/ui_toaster.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('toaster').then(
                              function(){
                                 return $ocLazyLoad.load('/js/controllers/toaster.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.ui.jvectormap', {
                  url: '/jvectormap',
                  templateUrl: 'tpl/ui_jvectormap.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('/js/controllers/vectormap.js');
                      }]
                  }
              })
              .state('app.ui.googlemap', {
                  url: '/googlemap',
                  templateUrl: 'tpl/ui_googlemap.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( [
                            '/js/app/map/load-google-maps.js',
                            '/js/app/map/ui-map.js',
                            '/js/app/map/map.js'] ).then(
                              function(){
                                return loadGoogleMaps(); 
                              }
                            );
                      }]
                  }
              })
              .state('app.chart', {
                  url: '/chart',
                  templateUrl: 'tpl/ui_chart.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad){
                          return uiLoad.load('/js/controllers/chart.js');
                      }]
                  }
              })
              // table
              .state('app.table', {
                  url: '/table',
                  template: '<div ui-view></div>'
              })
              .state('app.table.static', {
                  url: '/static',
                  templateUrl: '/tpl/table_static.html'
              })
              .state('app.table.datatable', {
                  url: '/datatable',
                  templateUrl: '/tpl/table_datatable.html'
              })
              .state('app.table.footable', {
                  url: '/footable',
                  templateUrl: '/tpl/table_footable.html'
              })
              .state('app.table.grid', {
                  url: '/grid',
                  templateUrl: '/tpl/table_grid.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('ngGrid').then(
                              function(){
                                  return $ocLazyLoad.load('/js/controllers/grid.js');
                              }
                          );
                      }]
                  }
              })
              // examination
              .state('app.examination', {
                  url: '/examination',
                  template: '<div ui-view class="fade-in"></div>',
              })
              //考试试卷列表
              .state('app.examination.list',{
                  url: '/list',
                  templateUrl: '/tpl/examination/examination.list.html',
                  controller:'examinationCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load([
                                  '/js/app/examination/examination.list.js',
                                  '/js/controllers/examination/examination.js',
                                  '/js/services/examination/examination.client.service.js',
                                  //用户考试service
                                  '/js/services/userexamination/userExamination.client.service.js',
                                  //用户service(发布考试获取用户id)
                                  '/js/services/user/user.client.service.js',
                              ]);
                          }]
                  }
              })
              //考试试卷修改/添加
              .state('app.examination.update',{
                  url: '/update',
                  templateUrl: '/tpl/examination/examination.update.html',
                  controller:'examinationUpdateCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load([
                                  '/js/app/examination/examination.list.js',
                                  '/js/app/exercise/exercise.list2.js',
                                  '/js/services/exercise/exercise.client.service.js',
                                  '/js/services/examinationcategory/examinationCategory.client.service.js',
                                  '/js/app/user/user.list2.js',
                                  '/js/services/paper/paper.client.service.js'
                              ]);
                          }]
                  },
                  params: {
                      data: null,
                      isUpdate:1
                  }
              })
              //试卷习题查看
              .state('app.examination.exerciseShow',{
                  url: '/exerciseShow',
                  templateUrl: '/tpl/paper/paper.showExers.html',
                  controller:'showPaperExerCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load([
                                  //zhushi
                                  '/js/services/onlineExamination/onlineExamination.client.service.js',
                              ]);
                          }]
                  },
                  params: {
                      paperId: null
                  }
              })
              //试卷类属
              .state('app.examination.categoryList',{
                  url: '/categoryList',
                  templateUrl: '/tpl/examinationcategory/examinationCategory.list.html',
                  controller:'examinationCategoryCtrl',
                  controllerAs:'aa',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load([
                                  '/js/app/examinationcategory/examinationcategory.list.js',
                                  '/js/controllers/examinationcategory/examinationCategory.js',
                                  '/js/services/examinationcategory/examinationCategory.client.service.js'
                              ]);
                          }]
                  }
              })
              //展示给用户的试卷列表
              .state('app.examination.myExams',{
                  url: '/myExams',
                  templateUrl: '/tpl/examination/user/examination.user.list.html',
                  controller:'examinationUserCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load([
                                  '/js/controllers/examination/user/examinationUserCtrl.js',
                                  '/js/services/examination/user/examinationUser.client.service.js',
                                  '/js/services/user/user.client.service.js',
                                  '/js/services/signin/signin.client.service.js'
                              ]);
                          }]
                  },
                  params: {
                      data: null,
                  }
              })
              //展示给用户已经预约的考试
              .state('app.examination.myOrder',{
                  url: '/myOrder',
                  templateUrl: '/tpl/examination/user/examination.user.myorder.html',
                  controller:'examinationUserMyOrderCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load([
                                  '/js/controllers/examination/user/examinationUserCtrl.js',
                                  '/js/services/examination/user/examinationUser.client.service.js'
                              ]);
                          }]
                  },
                  params: {
                      data: null,
                  }
              })
              //展示给用户已经成绩
              .state('app.examination.myScore',{
                  url: '/myScore',
                  templateUrl: '/tpl/examination/user/examination.user.myscore.html',
                  controller:'examinationUserMyScoreCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load([
                                  '/js/controllers/examination/user/examinationUserCtrl.js',
                                  '/js/services/examination/user/examinationUser.client.service.js'
                              ]);
                          }]
                  },
                  params: {
                      data: null,
                  }
              })
              //试题列表
              .state('app.examination.exerciseList',{
                  url: '/exerciseList',
                  templateUrl: '/tpl/exercise/exercise.list.html',
                  controller:'exerciseCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load([
                                  '/js/controllers/exercises/exercise.js',
                                  '/js/services/exercise/exercise.client.service.js',
                                  '/js/app/exercise/exercise.list.js'
                              ]);
                          }]
                  },
                  params: {
                      data: null,
                  }
              })
              //试题更新/添加
              .state('app.examination.exerciseUpdate',{
                  url: '/exerciseUpdate',
                  templateUrl: '/tpl/exercise/exercise.update.html',
                  controller:'exerciseUpdateCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load([
                                  '/js/controllers/exercises/exercise.js',
                                  '/js/services/exercise/exercise.client.service.js',
                                  '/js/services/examinationcategory/examinationCategory.client.service.js'
                              ]);
                          }]
                  },
                  params: {
                      data: null,
                      isUpdate:"1"
                  }
              })
              //用户成绩列表
              .state('app.examination.scoreList',{
                  url: '/scoreList',
                  templateUrl: '/tpl/userscore/userScore.list.html',
                  controller:'userScoreCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load([
                                  '/js/app/userscore/userScore.list.js',
                                  '/js/controllers/userscore/userScore.js',
                                  '/js/services/userscore/userScore.client.service.js'

                              ]);
                          }]
                  }
              })
              //试卷列表
              .state('app.examination.paperList',{
                  url: '/paperList',
                  templateUrl: '/tpl/paper/paper.list.html',
                  controller:'paperCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function ($ocLazyLoad) {
                              return $ocLazyLoad.load([
                                  '/js/app/paper/paper.list.js',
                                  '/js/controllers/paper/paper.js',
                                  '/js/services/paper/paper.client.service.js',
                              ]);
                          }]
                  }
              })
              //试卷更新
              .state('app.examination.paperUpdate',{
                  url: '/paperUpdate',
                  templateUrl: '/tpl/paper/paper.update.html',
                  controller:'paperUpdateCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load([
                                  '/js/controllers/paper/paper.js',
                                  '/js/services/paper/paper.client.service.js',
                                  '/js/app/exercise/exercise.list2.js',
                                  '/js/services/exercise/exercise.client.service.js',
                                  '/js/services/examinationcategory/examinationCategory.client.service.js'
                              ]);
                          }]
                  },
                  params: {
                      data: null,
                      isUpdate:"1"
                  }
              })

              //角色用户管理
              .state('app.yonghu', {
                  url: '/yonghu',
                  template: '<div ui-view class="fade-in"></div>',
              })
              //用户列表
              .state('app.yonghu.list',{
                  url: '/list',
                  templateUrl: '/tpl/CharacterManager/CharacterManager_yonghu.html',
                  controller:'CharacterCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load([
                                  '/js/app/Charactermanager/yonghu.js',
                                  '/js/controllers/Charactermanager/yonghu.js',
                                  '/js/services/character/character.client.service.js',
                              ]);
                          }]
                  }
              })
              //用户更新/修改
              .state('app.yonghu.update',{
                  url: '/update',
                  templateUrl: '/tpl/CharacterManager/character.update.html',
                  controller:'CharacterUpdateCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load([
                                  '/js/app/Charactermanager/yonghu.js',
                                  '/js/controllers/Charactermanager/yonghu.js',
                                  '/js/services/character/character.client.service.js',
                                  '/js/services/depart/depart.client.service.js',
                                  '/js/services/usergroup/userGroup.client.service.js',
                              ]);
                          }]
                  },
                  params: {
                      data: null,
                      isUpdate:1
                  }
              })
              //部门管理
              .state('app.yonghu.departList',{
                  url: '/departList',
                  templateUrl: '/tpl/depart/depart.list.html',
                  controller:'departCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load([
                                  '/js/app/depart/depart.list.js',
                                  '/js/controllers/depart/depart.js',
                                  '/js/services/depart/depart.client.service.js',
                              ]);
                          }]
                  },
                  params: {
                      data: null,
                      isUpdate:1
                  }
              })

              //用户组
              .state('app.yonghu.userGroupList',{
                  url: '/userGroupList',
                  templateUrl: '/tpl/usergroup/userGroup.list.html',
                  controller:'userGroupCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load([
                                  '/js/app/usergroup/userGroup.list.js',
                                  '/js/controllers/usergroup/userGroup.js',
                                  '/js/services/usergroup/userGroup.client.service.js',
                              ]);
                          }]
                  },
                  params: {
                      data: null,
                      isUpdate:1
                  }
              })
              .state('app.yonghu.userGroupUpdate',{
                  url: '/userGroupUpdate',
                  templateUrl: '/tpl/usergroup/userGroup.update.html',
                  controller:'userGroupUpdateCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load([
                                  '/js/services/usergroup/userGroup.client.service.js',
                                  '/js/services/menu/menu.client.service.js'
                              ]);
                          }]
                  },
                  params: {
                      data: null,
                      isUpdate:1
                  }
              })






              .state('app.form.elements', {
                  url: '/elements',
                  templateUrl: 'tpl/form_elements.html'
              })
              .state('app.form.validation', {
                  url: '/validation',
                  templateUrl: 'tpl/form_validation.html'
              })
              .state('app.form.wizard', {
                  url: '/wizard',
                  templateUrl: 'tpl/form_wizard.html'
              })
              .state('app.form.fileupload', {
                  url: '/fileupload',
                  templateUrl: 'tpl/form_fileupload.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('angularFileUpload').then(
                              function(){
                                 return $ocLazyLoad.load('/js/controllers/file-upload.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.imagecrop', {
                  url: '/imagecrop',
                  templateUrl: 'tpl/form_imagecrop.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('ngImgCrop').then(
                              function(){
                                 return $ocLazyLoad.load('/js/controllers/imgcrop.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.select', {
                  url: '/select',
                  templateUrl: 'tpl/form_select.html',
                  controller: 'SelectCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('ui.select').then(
                              function(){
                                  return $ocLazyLoad.load('/js/controllers/select.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.slider', {
                  url: '/slider',
                  templateUrl: 'tpl/form_slider.html',
                  controller: 'SliderCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('vr.directives.slider').then(
                              function(){
                                  return $ocLazyLoad.load('/js/controllers/slider.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.editor', {
                  url: '/editor',
                  templateUrl: 'tpl/form_editor.html',
                  controller: 'EditorCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('textAngular').then(
                              function(){
                                  return $ocLazyLoad.load('/js/controllers/editor.js');
                              }
                          );
                      }]
                  }
              })

              // pages
              .state('app.page', {
                  url: '/page',
                  template: '<div ui-view class="fade-in-down"></div>'
              })
              .state('app.page.profile', {
                  url: '/profile',
                  templateUrl: 'tpl/page_profile.html'
              })
              .state('app.page.post', {
                  url: '/post',
                  templateUrl: 'tpl/page_post.html'
              })
              .state('app.page.search', {
                  url: '/search',
                  templateUrl: 'tpl/page_search.html'
              })
              .state('app.page.invoice', {
                  url: '/invoice',
                  templateUrl: 'tpl/page_invoice.html'
              })
              .state('app.page.price', {
                  url: '/price',
                  templateUrl: 'tpl/page_price.html'
              })
              .state('app.docs', {
                  url: '/docs',
                  templateUrl: 'tpl/docs.html'
              })
              // others
              .state('lockme', {
                  url: '/lockme',
                  templateUrl: 'tpl/page_lockme.html'
              })
              .state('access', {
                  url: '/access',
                  template: '<div ui-view class="fade-in-right-big smooth"></div>'
              })
              .state('access.signin', {
                  url: '/signin',
                  templateUrl: 'tpl/page_signin.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['/js/controllers/signin.js'] );
                      }]
                  }
              })
              .state('access.signup', {
                  url: '/signup',
                  templateUrl: 'tpl/page_signup.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['/js/controllers/signup.js'] );
                      }]
                  }
              })
              .state('access.forgotpwd', {
                  url: '/forgotpwd',
                  templateUrl: 'tpl/page_forgotpwd.html'
              })
              .state('access.404', {
                  url: '/404',
                  templateUrl: 'tpl/page_404.html'
              })

              // fullCalendar
              .state('app.calendar', {
                  url: '/calendar',
                  // use resolve to load other dependences
                  templateUrl: '/tpl/app_calendar.html',
                  resolve: {
                      deps: ['$ocLazyLoad', 'uiLoad',
                        function( $ocLazyLoad, uiLoad ){
                          return uiLoad.load(
                            ['/lib/jquery/fullcalendar/fullcalendar.css',
                              '/lib/jquery/fullcalendar/theme.css',
                              '/lib/jquery/jquery-ui-1.10.3.custom.min.js',
                              '/lib/libs/moment.min.js',
                              '/lib/jquery/fullcalendar/fullcalendar.min.js',
                              '/js/app/calendar/calendar.js']
                          ).then(
                            function(){
                              return $ocLazyLoad.load('ui.calendar');
                            }
                          )
                      }]
                  }
              })

              // mail
              .state('app.mail', {
                  abstract: true,
                  url: '/mail',
                  templateUrl: '/tpl/mail.html',
                  // use resolve to load other dependences
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['/js/app/mail/mail.js',
                                               '/js/app/mail/mail-service.js',
                                               'vendor/libs/moment.min.js'] );
                      }]
                  }
              })
              .state('app.mail.list', {
                  url: '/inbox/{fold}',
                  templateUrl: 'tpl/mail.list.html'
              })
              .state('app.mail.detail', {
                  url: '/{mailId:[0-9]{1,4}}',
                  templateUrl: 'tpl/mail.detail.html'
              })
              .state('app.mail.compose', {
                  url: '/compose',
                  templateUrl: 'tpl/mail.new.html'
              })

              .state('layout', {
                  abstract: true,
                  url: '/layout',
                  templateUrl: 'tpl/layout.html'
              })
              .state('layout.fullwidth', {
                  url: '/fullwidth',
                  views: {
                      '': {
                          templateUrl: 'tpl/layout_fullwidth.html'
                      },
                      'footer': {
                          templateUrl: 'tpl/layout_footer_fullwidth.html'
                      }
                  },
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['/js/controllers/vectormap.js'] );
                      }]
                  }
              })
              .state('layout.mobile', {
                  url: '/mobile',
                  views: {
                      '': {
                          templateUrl: 'tpl/layout_mobile.html'
                      },
                      'footer': {
                          templateUrl: 'tpl/layout_footer_mobile.html'
                      }
                  }
              })
              .state('layout.app', {
                  url: '/app',
                  views: {
                      '': {
                          templateUrl: 'tpl/layout_app.html'
                      },
                      'footer': {
                          templateUrl: 'tpl/layout_footer_fullwidth.html'
                      }
                  },
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['/js/controllers/tab.js'] );
                      }]
                  }
              })
              .state('apps', {
                  abstract: true,
                  url: '/apps',
                  templateUrl: 'tpl/layout.html'
              })
              .state('apps.note', {
                  url: '/note',
                  templateUrl: 'tpl/apps_note.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['/js/app/note/note.js',
                                               'vendor/libs/moment.min.js'] );
                      }]
                  }
              })
              .state('apps.contact', {
                  url: '/contact',
                  templateUrl: 'tpl/apps_contact.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['/js/app/contact/contact.js'] );
                      }]
                  }
              })
              .state('app.weather', {
                  url: '/weather',
                  templateUrl: 'tpl/apps_weather.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(
                              {
                                  name: 'angular-skycons',
                                  files: ['/js/app/weather/skycons.js',
                                          'vendor/libs/moment.min.js', 
                                          '/js/app/weather/angular-skycons.js',
                                          '/js/app/weather/ctrl.js' ] 
                              }
                          );
                      }]
                  }
              })
              .state('music', {
                  url: '/music',
                  templateUrl: 'tpl/music.html',
                  controller: 'MusicCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load([
                            'com.2fdevs.videogular', 
                            'com.2fdevs.videogular.plugins.controls', 
                            'com.2fdevs.videogular.plugins.overlayplay',
                            'com.2fdevs.videogular.plugins.poster',
                            'com.2fdevs.videogular.plugins.buffering',
                            '/js/app/music/ctrl.js', 
                            '/js/app/music/theme.css'
                          ]);
                      }]
                  }
              })
              .state('music.home', {
                    url: '/home',
                    templateUrl: 'tpl/music.home.html'
                })
              .state('music.genres', {
                    url: '/genres',
                    templateUrl: 'tpl/music.genres.html'
                })
              .state('music.detail', {
                    url: '/detail',
                    templateUrl: 'tpl/music.detail.html'
                })
              .state('music.mtv', {
                    url: '/mtv',
                    templateUrl: 'tpl/music.mtv.html'
                })
              .state('music.mtvdetail', {
                    url: '/mtvdetail',
                    templateUrl: 'tpl/music.mtv.detail.html'
                })
              .state('music.playlist', {
                    url: '/playlist/{fold}',
                    templateUrl: 'tpl/music.playlist.html'
                })

      }
    ]
  );
