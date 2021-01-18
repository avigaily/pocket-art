var sockets = {}; // stores all the connected clients
var games = {}; // stores the ongoing games
var waitingRooms = {};// stores the ongoing waiting rooms

//socket={id, name, is_playing, game_id}

// Generate Game ID
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function socketFunction(client, io) {
    client.emit('connected', { "id": client.id });
    // handle user registration 
    client.on('checkUserDetail', data => {
        console.log('check detail got', data.name);
        var flag = false;
        //check if name already in sockets 
        for (var id in sockets) {
            if (sockets[id].name === data.name) {
                flag = true;
                break;
            }
        }
        //if user is new - add to sockets
        if (!flag) {
            sockets[client.id] = {
                id: client.id,
                name: data.name,
                is_playing: false,
                game_id: null
            };
        }
        //todo: err msg - name taken
        var response = { flag: !flag, user: sockets[client.id] }
        client.emit('checkUserDetailResponse', response);
    });

    // send all the players who are online and avalable to play
    client.on('getOpponents', () => {
        var opponents = [];
        for (var id in sockets) {
            if (id !== client.id && !sockets[id].is_playing) {
                opponents.push({
                    id: id,
                    name: sockets[id].name,
                });
            }
        }
        client.emit('getOpponentsResponse', opponents);
        //emit to other sockets that the client is on their list now
        client.broadcast.emit('newOpponentAdded', {
            id: client.id,
            name: sockets[client.id].name,
        });
    });

    // data={id:id}, todo: add to data waiting room id
    client.on('inviteOpponent', data => {
        let invitationDetails = {
            to: data.id,
            from: client.id,
            inviter: sockets[client.id],
        }
        //send to specific user
        console.log('server inviting');
        io.to(invitationDetails.to).emit('receivedInvitation', invitationDetails);
    });

    //emits to inviting player
    //emits socket object of accepting player
    client.on('acceptInvitation', inviterId => {
        console.log('server got ok from', client.id, 'to', inviterId);
        io.to(inviterId).emit('invitationResponse', { answer: 'accept', opponent: sockets[client.id] });
    })

    //declineInvitation
    // client.on('declineInvitation', data => {
    //     let declining = sockets[client.id]
    //     let waitingRoom = waitingRooms[declining.waitingRoom_id]
    //     let payload = {
    //         declining,
    //         waitingRoom: waitingRoom,
    //     }
    //     io.to(declining.waitingRoom_id).emit('declineInvitationResponse', payload);
    // })

    client.on('startGame', data => {
        console.log('starting game');
        //init game
        var gameId = uuidv4();
        sockets[data.id].is_playing = true;
        sockets[client.id].is_playing = true;
        sockets[data.id].game_id = gameId;
        sockets[client.id].game_id = gameId;
        games[gameId] = {
            players: { 
                [client.id]: sockets[client.id], 
                [data.id]: sockets[data.id] 
            },
            whose_turn: client.id,
            playboard: [],
            game_status: "ongoing", // "ongoing","won","draw"
            game_winner: null, // winner_id if status won
        };
        io.emit('gameStarted', { status: true, game_id: gameId, game_data: games[gameId] });
        // io.to(gameId).emit('gameStarted', { status: true, game_id: gameId, game_data: games[gameId] });
    })

    client.on('joinGame', data => {
        console.log('joining game');
        client.join(data)//data=gameid
    })
}

module.exports = {
    socketFunction
};
