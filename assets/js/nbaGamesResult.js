angular.module('nbaGamesResultApp',['ngResource'])

    .constant('defaults', {
         baseUrl: "http://www.nba.com",
         gameLine: "http://www.nba.com/gameline",
         teamImageUrl: "http://i.cdn.turner.com/nba/nba/.element/img/2.0/sect/gameline/teams/",
         gamesResultJson:"http://data.nba.com/data/1h/json/cms/noseason/scoreboard/:date/games.json"
    })

    .directive('nbaGamesResult',['defaults',function(defaults){
            return {
                    restrict: 'AE',
                    replace: true,
                    scope:{title:'@',option:'=',datePick:"@"},
                    controller: ['$scope','GetGameResult',  
                      function($scope,GetGameResult) 
                      {
                        console.log("NBA GAMES RESULT STARTED");
                        $scope.games = [];

                        $scope.getGames = function(e){
                            GetGameResult.get({date:e},function(response){
                               console.log('GetGameResult get ' + response.sports_content.games);
                              $scope.games = response.sports_content.games.game; 
                        });
                        
                      }
                   
                    }],
                    templateUrl: 'views/nbaGamesResult.html',

                    link: function(scope, elem, attrs) {                                                
                              console.log("NBA GAMES RESULT STARTED");
                              scope.loadGames=function(e){
                                    console.log("select date = " + scope.datePick);
                                    scope.getGames(scope.datePick);
                              }                                               

                              scope.getGameUrl = function(v){
                                    return defaults.baseUrl + "/games/" + v + "/gameinfo.html";
                              }

                              scope.getTeamFullName = function(v){
                                     return v.city + " " + v.nickname;
                              }

                              scope.getTeamAvatarUrl = function(v){
                                    return defaults.teamImageUrl + v + ".gif";
                              }


                              elem.bind("keydown keypress", function (event) {
                                    if(event.which === 13) {
                                        scope.$apply(function (){
                                           scope.loadGames();
                                        });

                                        event.preventDefault();
                                    }
                              });
                              
                              // this will listen the parent date-pick model
                              attrs.$observe('datePick', function(v) {
                                  console.log("date-pick  value = "+ v);
                                  scope.loadGames();

                              });
                              //load the games by defaults Todays date 
                              scope.loadGames();
                                     
                      }

                      };
                }])
 
                .factory('GetGameResult',['$resource','defaults',
                    function($resource,defaults){return  $resource(defaults.gamesResultJson);}]);