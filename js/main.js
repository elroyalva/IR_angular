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
  'chart.js',
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
      css: "css/stats.css"
    })
    .when("/tags/:tag", {
      templateUrl: "partials/tags.html", 
      controller: "TagsCtrl",
      css: "css/tags.css"
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
  $rootScope.resultData = null;
  console.log("Home Controller reporting for duty.");
  $scope.tags=[{"text":"Syria"},{"text":"Paris"}]
  // function loadItems($query){
  //   return tags;
  // }
  $scope.searchAdvanced = false;
  $scope.showAdvanced = function(){
     if (document.getElementById('formAdvanced').style.display == 'block') {
       document.getElementById('formAdvanced').style.display = 'none';
       document.getElementById('showAdvButton').value='Show Advanced Options';
        $scope.searchAdvanced = false;

    }
    else {
      document.getElementById('formAdvanced').style.display = 'block';
      document.getElementById('showAdvButton').value='Hide Advanced Options';
      $scope.searchAdvanced = true;
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
  $scope.fromDate = '2012-04-23';
  $scope.toDate = '2015-12-15';
  $scope.placeRequest = function(){
    if($scope.queryText){
      $scope.langAdvanced = [];
      $scope.sourceAdvanced = [];
      var searchTags=[];
      for(tag in $scope.tags){
        // console.log(JSON.stringify(tag));
        searchTags.push($scope.tags[tag].text);
      }
      // console.log(JSON.stringify(searchTags));
      // console.log(JSON.stringify($scope.country));
      // console.log(JSON.stringify($scope.languageSelected));
      if($scope.languageSelected_en)
        $scope.langAdvanced.push("en");
      if($scope.languageSelected_fr)
        $scope.langAdvanced.push("fr");
      if($scope.languageSelected_es)
        $scope.langAdvanced.push("es");
      if($scope.languageSelected_ar)
        $scope.langAdvanced.push("ar");

      if($scope.fromDataSource_fl)
        $scope.sourceAdvanced.push("Flickr");
      if($scope.fromDataSource_tw)
        $scope.sourceAdvanced.push("Twitter");
      if($scope.fromDataSource_tu)
        $scope.sourceAdvanced.push("Tumblr");
      
      var req = {
         method: 'POST',
         url: 'http://52.24.214.137:8080/SolrSearch/solr/search',
         headers: {
           'Content-Type': 'application/json'
         },
         data: {
            "query_sent": $scope.queryText || '',
            "advanced":$scope.searchAdvanced,
            "advanced_attributes":{
              "tags": searchTags,
              "location": $scope.country || '',
              "date":{
                "from":$scope.fromDate+'T00:00:00.0Z',
                "to":$scope.toDate+'T23:59:59.9Z'
              },
              "lang": $scope.langAdvanced,
              "hasImages":false,
              "sortbyViews":false,                          
              "data_source":[],                 
              "urls":$scope.sourceAdvanced
            }
          }
        }
      console.log(JSON.stringify(req));
      $rootScope.queryHolder = $scope.queryText;
        // $http(req).then(function(){...}, function(){...});


        $http(req)
        .then(function(data) {
          // alert($scope.queryText);
          $scope.data = data;
          $rootScope.resultData = data.data;
        console.log(JSON.stringify($rootScope.resultData));
          // $rootScope.resultData = data;
        $location.path('/results');
        });
      }
      else{
        alert("Enter a search query!!");
      }
    }
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
      // alert(JSON.stringify($rootScope.resultData));


  //     $scope.$on('$viewContentLoaded', function(){
  //   //Here your view content is fully loaded !!
  // });
     $scope.emotionArray=["#00ff00","#00dd00","#5a93e9","#E69731","#ff0000"];
      if($rootScope.resultData === "" || $rootScope.resultData == null)
        $location.path('/');
      $scope.pos = 0;
      $scope.vpos = 0;
      $scope.neu = 0;
      $scope.neg = 0;
      $scope.vneg = 0;
      // alert(JSON.stringify($rootScope.resultData));
      $scope.data = $rootScope.resultData.response.docs;
      for(i=0; i<$scope.data.length;i++){
        if($scope.data[i].emotion === 'Very positive')
          $scope.vpos++;
        if($scope.data[i].emotion === 'Very negative')
          $scope.vneg++;
        if($scope.data[i].emotion === 'Positive')
          $scope.pos++;
        if($scope.data[i].emotion === 'Neutral')
          $scope.neu++;
        if($scope.data[i].emotion === 'Negative')
          $scope.neg++;
      }
      // alert($scope.neu+''+$scope.vneg+''+$scope.vpos+''+$scope.neg+''+$scope.pos);

      $scope.emotionLabels=["Very Positive","Positive", "Neutral", "Negative", "Very Negative"];
      $scope.emotionData= [$scope.vpos,$scope.pos,$scope.neu,$scope.neg,$scope.vneg];
      
});

app.controller('TagsCtrl', function($routeParams, $scope, $rootScope, $location, $http){
  $scope.emotionArray=["#00ff00","#00dd00","#5a93e9","#E69731","#ff0000"];
  $rootScope.resultData=null;
  var req = {
         method: 'POST',
         url: 'http://52.24.214.137:8080/SolrSearch/solr/search',
         headers: {
           'Content-Type': 'application/json'
         },
         data: {
            "query_sent": $routeParams.tag,
            "advanced": true,
            "advanced_attributes":{
              "tags": [$routeParams.tag],
              "location": '',
              "date":{
                "from":'2012-04-23T23:59:59.9Z',
                "to":'2015-12-15T23:59:59.9Z'
              },
              "lang": [],
              "hasImages":false,
              "sortbyViews":false,                          
              "data_source":[],                 
              "urls": []
            }
          }
        }
        console.log(req);
        $scope.queryHolder = $routeParams.tag;
        // alert(req);
        // alert($routeParams.tag);
        $http(req)
        .then(function(data) {
          // alert($scope.queryText);
          $scope.data = data;
          $rootScope.resultData = data.data;
        console.log(JSON.stringify($rootScope.resultData));
        $scope.pos = 0;
        $scope.vpos = 0;
        $scope.neu = 0;
        $scope.neg = 0;
        $scope.vneg = 0;
        // alert(JSON.stringify($rootScope.resultData));
        $scope.data = $rootScope.resultData.response.docs;
        for(i=0; i<$scope.data.length;i++){
          if($scope.data[i].emotion === 'Very positive')
            $scope.vpos++;
          if($scope.data[i].emotion === 'Very negative')
            $scope.vneg++;
          if($scope.data[i].emotion === 'Positive')
            $scope.pos++;
          if($scope.data[i].emotion === 'Neutral')
            $scope.neu++;
          if($scope.data[i].emotion === 'Negative')
            $scope.neg++;
        }
        // alert($scope.neu+''+$scope.vneg+''+$scope.vpos+''+$scope.neg+''+$scope.pos);

        $scope.emotionLabels=["Very Positive","Positive", "Neutral", "Negative", "Very Negative"];
        $scope.emotionData= [$scope.vpos,$scope.pos,$scope.neu,$scope.neg,$scope.vneg];

          // $rootScope.resultData = data;
        });

});

/**
 * Controls all other Pages
 */
app.controller('StatsCtrl', function ( $scope, $rootScope, $location, $http, $route) {
  // console.log("Page Controller reporting for duty.");
  $scope.hashtagLabels = [];
  $scope.hashtagData = [];
  $scope.langLabels = [];
  $scope.langData = [];
  $scope.locationLabels = [];
  $scope.locationData = [];
  $scope.emotionLabels = [];
  $scope.emotionData = [];

$.ajax({
  'url': 'http://52.24.214.137:8983/solr/partc/admin/luke?fl=hashtags&numTerms=10&wt=json&indent=true',
  'data': {'wt':'json','fl':'hashtags','numTerms':'10','indent':'true'},
  'success': function(data) {
    // alert(JSON.stringify(data));
    $scope.topHashtags = data;
    for(i=0;i<20;i=i+2){
      $scope.hashtagLabels.push(data.fields.hashtags.topTerms[i]);
      $scope.hashtagData.push(data.fields.hashtags.topTerms[i+1]);
    }
  },
  'dataType': 'jsonp',
  'jsonp': 'json.wrf'
});


$.ajax({
  'url': 'http://52.24.214.137:8983/solr/partc/admin/luke?fl=lang&numTerms=10&wt=json&indent=true',
  'data': {'wt':'json','fl':'hashtags','numTerms':'10','indent':'true'},
  'success': function(data) {
    // alert(JSON.stringify(data));
    $scope.topHashtags = data;
    for(i=0;i<6;i=i+2){
      $scope.langLabels.push(data.fields.lang.topTerms[i]);
      $scope.langData.push(data.fields.lang.topTerms[i+1]);
    }
  },
  'dataType': 'jsonp',
  'jsonp': 'json.wrf'
});

$.ajax({
  'url': 'http://52.24.214.137:8983/solr/partc/admin/luke?fl=entity_location&numTerms=10&wt=json&indent=true',
  'data': {'wt':'json','fl':'hashtags','numTerms':'10','indent':'true'},
  'success': function(data) {
    // alert(JSON.stringify(data));
    $scope.topHashtags = data;
    for(i=0;i<20;i=i+2){
      $scope.locationLabels.push(data.fields.entity_location.topTerms[i]);
      $scope.locationData.push(data.fields.entity_location.topTerms[i+1]);
    }
  },
  'dataType': 'jsonp',
  'jsonp': 'json.wrf'
});

$.ajax({
  'url': 'http://52.24.214.137:8983/solr/partc/admin/luke?fl=emotion&numTerms=10&wt=json&indent=true',
  'data': {'wt':'json','fl':'hashtags','numTerms':'10','indent':'true'},
  'success': function(data) {
    // alert(JSON.stringify(data));
    $scope.topHashtags = data;
    for(i=0;i<data.fields.emotion.topTerms.length;i=i+2){
      $scope.emotionLabels.push(data.fields.emotion.topTerms[i]);
      $scope.emotionData.push(data.fields.emotion.topTerms[i+1]);
    }
  },
  'dataType': 'jsonp',
  'jsonp': 'json.wrf'
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