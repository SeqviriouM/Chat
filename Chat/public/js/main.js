var socket = io('http://seqvirioum.com');

var nickColors = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];

var skipHistory = 0; // skip blocks from the end


// Get color for user's nickname
function getNicknameColor() {
    var index = Math.floor(Math.random()*nickColors.length);

    return nickColors[index];
}

function placeMessage(text, type) {
    /* 
        type - type to place message
            1 - append (place at the end)
            2 - prepand (place at the beginning)
    */

    if (type === 1) {
        $('.output-section #messages').append(text);
    } else {
        $('.output-section #messages').prepend(text);
    }
    
}

function scrollTop() {
    $('.output-section #messages-area')[0].scrollTop = $('.output-section #messages-area')[0].scrollHeight;
}

socket.on('load-history', function(data) {
    var text;

    for (line in data.data) {
        //text = "<div><p style='opacity: 0.5;'><span class='nick' style='color: " + data.data[line].color + "'>" + data.data[line].user + ":</span>" + data.data[line].message + "</p></div>"; 
        text = "<div class='message history'>\
            <div class='nick' style='color: " + data.data[line].color + "'>" + data.data[line].user + "</div>\
            <div class='text'>" + data.data[line].message + "</div>\
            <div class='clearfix'></div>\
            </div>";    
        placeMessage(text, 2);
    }
    scrollTop();
});


socket.on('user-joined', function(data) {
    var text;
    
    text = "<div><p class='user-information'><span class='nick'>" + data.nick + "</span> has joined to chat</p></div>";
    placeMessage(text, 1);
    scrollTop();

    new PNotify({
        type: 'info',
        title: 'New User',
        text: 'New user has entered to chat.'
    });
    
    
    $scope.$apply(function() {
        $scope.$$childHead.users.push(data.nick);
    });
});

socket.on('append-text', function(data) {
    var text;

    //text = "<div><p><span class='nick' style='color: " + data.color + "'>" + data.nick + ":</span>" + data.text + "</p></div>";
    text = "<div class='message'>\
        <div class='nick' style='color: " + data.color + "'>" + data.nick + "</div>\
        <div class='text'>" + data.text + "</div>\
        <div class='clearfix'></div>\
    </div>";
    placeMessage(text, 1);
    scrollTop();
});

socket.on('user-left', function(data) {
    var text; 

    text = "<div><p class='user-information'><span class='nick'>" + data.nick + "</span> has left the chat</p></div>";
    placeMessage(text, 1);
    scrollTop();

    new PNotify({
        type: 'info',
        title: 'User left',
        text: 'User has lefted the chat.'
    });
    
    $scope.$apply(function() {
        var index = $scope.$$childHead.users.indexOf(data.nick);
        $scope.$$childHead.users.splice(index,1);
    });
});


var app = angular.module('Chat', ['ngRoute', 'components', 'ngDialog']);

app.config(function($routeProvider, ngDialogProvider) {
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

     ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        plain: false,
        showClose: true,
        closeByDocument: true,
        closeByEscape: true,
        appendTo: false,
        preCloseCallback: function () {
          console.log('default pre-close callback');
        }
    });
});

app.controller('UsersOnlineController', ['$scope', function($scope) {
    
    $scope.users = [];

}]);

app.controller('TopNavigation', ['$scope', 'ngDialog', function($scope, ngDialog) {
    
    $scope.openDialog = function(){
        ngDialog.open({
            template: 'rootConsole',
            controller: 'rootConsoleController',
            className: 'ngdialog-theme-default ngdialog-theme-custom'
        })
    }

}]);

app.controller('rootConsoleController', ['$scope',  function($scope){
    $scope.users = $scope.$parent.users;
    
    $scope.kick = function() {
        socket.emit("kick-user",{user: this.user})
    }
}]);



$(function () {


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
        .on('click', '#load-more-messages', function() {
            skipHistory += 20;
            socket.emit('early-history', {skip: skipHistory});
        });

    (function(){
        // Get nickname from chat.ejs. Function getNick declared in chat.ejs
        var nickname = getNick();  
        var nicknameColor = getNicknameColor();

        var ng_app = $('[ng-app="Chat"]');
        var $scope = angular.element(ng_app).scope();

        $scope.$apply(function(){
            $scope.users = [];
        }) 

        socket.emit('new-user', {nick: nickname, color: nicknameColor});
    })();   

});