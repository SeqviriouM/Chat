jQuery(document).ready(function () {

    var socket = io('http://seqvirioum.com');

    var ng_app = $('[ng-app="Chat"]');
    var $scope = angular.element(ng_app).scope();

    var local_history = [];

    $scope.$apply(function(){
        $scope.users = [];
    }) 

    var nickColors = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];


    $('body')
        .on('click', '#send', function() {
            var text = $("#input-text").val();
            //Strip html tags 
            text = text.replace(/(<([^>]+)>)/ig,"");
            $("#input-text").val("");

            socket.emit('new-message', {value: text});
        })

        .on('keydown', '#input-text', function(event){
            // Нажат Enter
            if (event.keyCode === 13) {
                $('#send').click();
            }            
        })

    // Get color for user's nickname
    function getNicknameColor() {
        var index = Math.floor(Math.random()*nickColors.length);

        return nickColors[index];
    }

    function placeMessage(text) {
        $('.output-section #messages').append(text);
        if ($('.chat').css('display') == "none") {
            alert(text);
        }
    }

    function scrollTop() {
        $('.output-section #messages')[0].scrollTop = $('.output-section #messages')[0].scrollHeight;
    }
    
    socket.on('load-history', function(data) {
        var text;
        for (line in data.data) {
            text = "<div><p style='opacity: 0.5;'><span class='nick' style='color: " + data.data[line].color + "'>" + data.data[line].user + ":</span>" + data.data[line].message + "</p></div>";
            placeMessage(text);     
        }
        scrollTop();
    });

    
    socket.on('user-joined', function(data) {
        var text = "<div><p class='user-information'><span class='nick'>" + data.nick + "</span> has joined to chat</p></div>";
        placeMessage(text);
        //$('.output-section #messages').append("<div><p class='user-information'><span class='nick'>" + data.nick + "</span> has joined to chat</p></div>");
        scrollTop();
        
        $scope.$apply(function() {
            $scope.$$childHead.users.push(data.nick);
        });
    });

    socket.on('show-chat', function(data) {
        // $.when($('.sign_in_form').fadeOut('slow')).then(function() {
        //     $('.chat-content').fadeIn('slow');        
        // })
    });

    socket.on('append-text', function(data) {
        var text = "<div><p><span class='nick' style='color: " + data.color + "'>" + data.nick + ":</span>" + data.text + "</p></div>";
        placeMessage(text);
        //$('.output-section #messages').append("<div><p><span class='nick' style='color: " + data.color + "'>" + data.nick + ":</span>" + data.text + "</p></div>");     
        scrollTop();
        
    });

    socket.on('user-left', function(data) {
        var text = "<div><p class='user-information'><span class='nick'>" + data.nick + "</span> has left the chat</p></div>";
        placeMessage(text);
        scrollTop();
        
        $scope.$apply(function() {
            var index = $scope.$$childHead.users.indexOf(data.nick);
            $scope.$$childHead.users.splice(index,1);
        });
    });



    (function () {
        // Get nickname from chat.ejs. Function getNick declared in chat.ejs
        var nickname = getNick();  
        var nicknameColor = getNicknameColor();

        socket.emit('new-user', {nick: nickname, color: nicknameColor});
    })();

})


angular.module('Chat', ['ngRoute'])
    .config(function($routeProvider) {
        //$locationProvider.html5Mode(true);
        $routeProvider
            .when('/chat', {
              templateUrl:'../html/chat.html'
            })
            .when('/users_online', {
              controller:'UsersOnlineController',
              templateUrl:'../html/users_online.html'
            })
            .when('/profile', {
              controller:'UsersOnlineController',
              templateUrl:'../html/profile.html'
            })
            .otherwise({
              redirectTo:'/chat'
            });
    })
    
    .controller('UsersOnlineController', ['$scope', function($scope) {
        
        $scope.users = [];
    }]);