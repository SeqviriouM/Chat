jQuery(document).ready(function () {

    var socket = io('http://seqvirioum.com');

    var nickColors = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];


    $('body')
        .on('click', '#sign-in', function() {
            var nickname = $('#input-nickname').val();
            
            var nicknameColor = getNicknameColor();

            socket.emit('new-user', {nick: nickname, color: nicknameColor});
        })

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

    function placeMessage(element, text) {

    }
 

    socket.on('user-joined', function(data) {
        $('.output-section #messages').append("<div><p class='user-information'><span class='nick'>" + data.nick + "</span> has joined to chat</p></div>");
    })

    socket.on('show-chat', function(data) {
        $.when($('.sign_in_form').fadeOut('slow')).then(function() {
            $('.chat').fadeIn('slow');        
        })
    })

    socket.on('append-text', function(data) {
        $('.output-section #messages').append("<div><p><span class='nick' style='color: " + data.color + "'>" + data.nick + ":</span>" + data.text + "</p></div>");     
    })

    socket.on('user-left', function(data) {
        $('.output-section #messages').append("<div><p class='user-information'><span class='nick'>" + data.nick + "</span> has left the chat</p></div>");
    })

})
