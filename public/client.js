$(document).ready(function () {
    // io() works only when connecting to a socket hosted on the same url/server. For connecting to an external socket hosted elsewhere, you would use io.connect('URL');
    /*global io*/
    let socket = io();

    // You can implement a way for your client to listen for this event! Similar to listening for a connection on the server, you will use the on keyword.
    socket.on('user', data => {
      $('#num-users').text(data.currentUsers + ' users online');
      let message =
        data.name +
        (data.connected ? ' has joined the chat.' : ' has left the chat.');
        $('#messages').append($('<li>').html('<b>' + message + '</b>'));
    });

    socket.on('chat message', (data) => {
      console.log('socket.on 1');
      $('#messages').append($('<li>').text(`${data.name}: ${data.message}`));
    });

    // Form submittion with new message in field with id 'm'
    $('form').submit(function () {
        var messageToSend = $('#m').val();
        //send message to server here
        socket.emit('chat message', messageToSend);
        $('#m').val('');
        return false; // prevent form submit from refreshing page
    });



});
