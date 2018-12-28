var play = document.querySelector('#play'),
    pass = document.querySelector('#pass'),
    schupf = document.querySelector('#schupf'),
    state = document.querySelector('#state'),
    cards = document.querySelector('#cards'),
    log = document.querySelector('#log')
    // TODO: websocket by userinput
    websocket = new WebSocket("ws://127.0.0.1:6789/");

play.onclick = function (event) {
    websocket.send(JSON.stringify({action: 'play', data: selected_cards}));
}
schupf.onclick = function (event) {
    websocket.send(JSON.stringify({action: 'schupf', data: selected_cards}));
}
pass.onclick = function (event) {
    websocket.send(JSON.stringify({action: 'pass', data: NaN}));
}
websocket.onmessage = function (event) {
    data = JSON.parse(event.data);
    switch (data.type) {
        case 'state':
            value.textContent = data.value;
            break;
        case 'users':
            users.textContent = (
                data.count.toString() + " user" +
                (data.count == 1 ? "" : "s"));
            break;
        case 'connection':
            log.textContent += data.content;
            console.error(data);
            break;
        case 'authentication':
            if (data.content == 'credentials')
                websocket.send(JSON.stringify({uname: 'gagi'}))
            else if (data.content == 'success')
                state.textContent = 'Successfully registered as ' + data.uname
            break;


        default:
            console.log(event.data)
            log.textContent += event.data
    }
};
