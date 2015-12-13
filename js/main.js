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
  '720kb.datepicker'
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
      controller: "PageCtrl",
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

app.controller('HomeCtrl', function ($scope, $location, $http, $rootScope) {
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

  $rootScope.query = {
  "query_sent":"El Chapo",
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
};
    // console.log(JSON.stringify($rootScope.query));



});

app.controller('ResultCtrl', function($scope, $location, $http, $rootScope){
  // $.getJSON("../data/response.json", function(json) {
    // console.log(JSON.stringify(json)); // this will show the info it in firebug console
    // $rootScope.resultData = json;
    // console.log(JSON.stringify($scope.resultData.response.docs));
    // console.log(JSON.stringify($rootScope.query));
  // });
alert(JSON.stringify($rootScope.query));
    var req = {
     method: 'GET',
     url: 'http://192.168.0.13:8080/SolrSearch/solr/search',
     headers: {
       'Content-Type': 'application/json'
     },
     data: $rootScope.query
    }

    // $http(req).then(function(){...}, function(){...});


    $http(req)
    .then(function(data) {
      $scope.data = data;
      // $rootScope.resultData = data;
      console.log(JSON.stringify(data));

    });

});

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function (/* $scope, $location, $http */) {
  console.log("Page Controller reporting for duty.");

  // Activates the Carousel
  $('.carousel').carousel({
    interval: 5000
  });

  // Activates Tooltips for Social Links
  $('.tooltip-social').tooltip({
    selector: "a[data-toggle=tooltip]"
  })
});