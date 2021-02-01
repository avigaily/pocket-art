var sockets = {}; // all connected clients
var games = {}; // all ongoing games
var waitingRooms = {};// ongoing waiting rooms

//socket={id, name, isPlaying, gameId}

// Generate Game ID
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function socketFunction(client, io) {
    client.emit('connected', { "id": client.id });//todo: should id be with " "?
    // handle user registration 
    client.on('checkUserDetail', data => {
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
                waitingRoomId: null,
                isPlaying: false,
                gameId: null
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
            if (id !== client.id && !sockets[id].isPlaying) {
                opponents.push({
                    id: id,
                    name: sockets[id].name,
                });
            }
        }
        client.emit('getOpponentsResponse', opponents);
        //send to other sockets that client is on their list now
        client.broadcast.emit('newOpponentAdded', {
            id: client.id,
            name: sockets[client.id].name,
        });
    });

    client.on('inviteOpponent', opponentId => {
        var roomId = sockets[client.id].waitingRoomId
        if (!roomId) {
            roomId = uuidv4();
            waitingRooms[roomId] = {
                id: roomId,
                players: {}
            };
            waitingRooms[roomId].players[client.id] = sockets[client.id];
            sockets[client.id].waitingRoomId = roomId;
            client.join(waitingRooms[roomId]);
        }
        let invitationDetails = {
            to: opponentId,
            from: client.id,
            inviter: sockets[client.id],
            waitingRoomId: roomId
        };
        //send to opponent
        io.to(opponentId).emit('receivedInvitation', invitationDetails);
    });

    //send to inviting player
    client.on('acceptInvitation', invitationDetails => {
        let { waitingRoomId } = invitationDetails
        waitingRooms[waitingRoomId].players[client.id] = sockets[client.id];
        sockets[client.id].waitingRoomId = waitingRoomId;
        client.join(waitingRooms[waitingRoomId]);
        let response = {
            answer: 'accept',
            opponent: sockets[client.id]
        }
        io.to(invitationDetails.from).emit('invitationResponse', response);
    })

    client.on('declineInvitation', invitationDetails => {
        let response = {
            answer: 'decline',
            opponent: sockets[client.id]
        }
        io.to(invitationDetails.from).emit('invitationResponse', response);
    })

    client.on('startGame', data => {
        //init game
        let waitingRoomId = sockets[client.id].waitingRoomId
        let players = waitingRooms[waitingRoomId].players
        for (const playerId in players) {
            sockets[playerId].isPlaying = true;
            sockets[playerId].gameId = newGameId;
            players[playerId].isStoryTeller = client.id === playerId; //client is the first story teller
            players[playerId].score = 0;
            players[playerId].isFinishedTurn = false;
            players[playerId].cards = [];//todo: get random cards function
        }
        var newGameId = uuidv4();
        //todo: add to player score, role,cards,
        games[newGameId] = {
            id: newGameId,
            players: players,
            board: {
                description: '',
                centerCards: []
            },
            playersCount: Object.keys(players).length-1,
            winner: null, // winner id if status won
            turnStatus: 'story teller input part'// listeners pick their matching card part ,  listeners vote part , votes and scores show part, add card to each player part
        };
        client.join(games[newGameId])
        io.to(waitingRooms[waitingRoomId]).emit('gameStarted', games[newGameId]);
    })

    client.on('joinGame', gameId => {
        client.join(games[gameId])
    })

    client.on('endTurn', turnData => {
        console.log('turn ended', turnData);
    })
}

module.exports = {
    socketFunction
};
