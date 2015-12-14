/**
 * AngularJS Tutorial 1
 * @author Nick Kaye <nick.c.kaye@gmail.com>
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('tutorialWebApp', [
  'ngRoute',
  'routeStyles',
  'ngTagsInput',
  'ngAnimate',
  '720kb.datepicker',
  'chart.js'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {
      templateUrl: "partials/home.html", 
      controller: "HomeCtrl",
      css: "css/home.css"
    })
    // Pages
    // .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})
    // .when("/faq", {templateUrl: "partials/faq.html", controller: "PageCtrl"})
    .when("/results", {
      templateUrl: "partials/results.html",
      controller: "ResultCtrl",
      css: "css/results.css"
    })
    .when("/stats", {
      templateUrl: "partials/stats.html", 
      controller: "StatsCtrl",
      css: "css/main.css"
    })
    // .when("/contact", {templateUrl: "partials/contact.html", controller: "PageCtrl"})
    // Blog
    // .when("/blog", {templateUrl: "partials/blog.html", controller: "BlogCtrl"})
    // .when("/blog/post", {templateUrl: "partials/blog_item.html", controller: "BlogCtrl"})
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

/**
 * Controls the Blog
 */
app.controller('BlogCtrl', function (/* $scope, $location, $http */) {
  console.log("Blog Controller reporting for duty.");
});

app.controller('HomeCtrl', function ($scope, $rootScope, $location, $http) {
  console.log("Home Controller reporting for duty.");
  $scope.tags=[{"text":"Syria"},{"text":"Paris"}]
  // function loadItems($query){
  //   return tags;
  // }

  $scope.showAdvanced = function(){
     if (document.getElementById('formAdvanced').style.display == 'block') {
       document.getElementById('formAdvanced').style.display = 'none';
       document.getElementById('showAdvButton').value='Show Advanced Options';
    }
    else {
      document.getElementById('formAdvanced').style.display = 'block';
       document.getElementById('showAdvButton').value='Hide Advanced Options';
   }
  }

  $scope.yesnoCheck = function(){
    if (document.getElementById('countryCheck').checked) {
        document.getElementById('isCountry').style.display = 'block';
         document.getElementById('isCoord').style.display = 'none';
    }
    else {
      document.getElementById('isCountry').style.display = 'none';
      document.getElementById('isCoord').style.display = 'block';
   }
  }

  // $scope.date = new Date();

  var req = {
     method: 'POST',
     url: 'http://52.24.214.137:8080/SolrSearch/solr/search',
     headers: {
       'Content-Type': 'application/json'
     },
     data: {
        "query_sent":"Paris",
        "advanced":false,
        "advanced_attributes":{
          "tags":[],
          "location":"india",
          "date":{"from":"2012-04-23T18:25:43.511Z","to":"2015-12-23T18:25:43.511Z"},
          "lang":["en","fr","ar","es"],
          "hasImages":true,
          "sortbyViews":false,                          
          "data_source":["twitter","tumblr"],                 
          "urls":["t.co","fb.com"]
        }
      }
    }

    // $http(req).then(function(){...}, function(){...});


    $http(req)
    .then(function(data) {
      $scope.data = data;
      $rootScope.resultData = data.data;
    // console.log(JSON.stringify($rootScope.resultData));
      // $rootScope.resultData = data;

    });
// };



});

app.controller('ResultCtrl', function($scope, $rootScope, $location, $http){
  // $.getJSON("../data/response.json", function(json) {
    // console.log(JSON.stringify(json)); // this will show the info it in firebug console
    // $rootScope.resultData = json;
    // console.log(JSON.stringify($scope.resultData.response.docs));
    // console.log(JSON.stringify($rootScope.query));
  // });
// alert(JSON.stringify($rootScope.query));
      alert(JSON.stringify($rootScope.resultData));

});

/**
 * Controls all other Pages
 */
app.controller('StatsCtrl', function ( $scope, $rootScope, $location, $http) {
  // console.log("Page Controller reporting for duty.");
  $scope.hashtagLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  $scope.hashtagData = [300, 500, 100];

  // var req = {
  //    method: 'GET',
  //    url: 'http://52.24.214.137:8983/solr/partc/admin/luke?fl=hashtags&numTerms=10&wt=json&indent=true',
  //   }

  //   // $http(req).then(function(){...}, function(){...});


  //   $http(req)
  //   .then(function(data) {
  //     alert(data);
  //     // $scope.data = data;
  //     // $rootScope.resultData = data.data;
  //   // console.log(JSON.stringify($rootScope.resultData));
  //     // $rootScope.resultData = data;
      
  //   });

$http.get('http://52.24.214.137:8983/solr/partc/admin/luke?fl=hashtags&numTerms=10&wt=json&indent=true').
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      console.log(data);
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log(JSON.stringify(config));
    });




});

app.directive('img', function () {
    return {
        restrict: 'E',        
        link: function (scope, element, attrs) {     
            // show an image-missing image
            element.error(function () {
                var w = element.width();
                var h = element.height();
                // using 20 here because it seems even a missing image will have ~18px width 
                // after this error function has been called
                if (w <= 20) { w = 100; }
                if (h <= 20) { h = 100; }
                var url = '/images/background.png';
                element.prop('src', url);
                element.css('border', 'double 3px #cccccc');
            });
        }
    }
});