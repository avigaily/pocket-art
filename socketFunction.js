var sockets = {}; // stores all the connected clients
var games = {}; // stores the ongoing games
var waitingRooms = {};// stores the ongoing waiting rooms

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
                id:client.id,
                name: data.name,
                is_playing: false,
                game_id: null
            };
        }

        //todo: err msg - name taken
        var response = {flag:!flag ,user:sockets[client.id]}

        client.emit('checkUserDetailResponse',response );
    });

    // send all the players who are online and avalable to play
    client.on('getOpponents', data => {
        var response = [];
        for (var id in sockets) {
            if (id !== client.id && !sockets[id].is_playing) {
                response.push({
                    id: id,
                    name: sockets[id].name,
                });
            }
        }
        client.emit('getOpponentsResponse', response);
        client.broadcast.emit('newOpponentAdded', {
            id: client.id,
            name: sockets[client.id].name,
        });
    });

    //inviteOpponents, data={id:id}
    client.on('inviteOpponents', data => {
        //send invitation
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
    client.on('acceptInvitation', data => {
        io.to(data.id).emit('invitationResponse', {answer:'accept',opponent:sockets[client.id]});
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

}

module.exports = {
    socketFunction
};
