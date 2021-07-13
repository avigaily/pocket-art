import gameService from '../../gameService.js';

export function setGame() {
    return {
      type: 'SET_GAME',
      gameData
    }
}

export function setUser(name) {
  return dispatch => {
    return gameService.getUser(name)
      .then(user => {
        dispatch({
          type: 'SET_USER',
          user
        })
        return user
      })
  }
}

export function loadWaitingRoom(id) {
  return dispatch => {
    return gameService.getWaitingRoom(id)
      .then(waitingRoom => {
        dispatch({
          type: 'SET_WAITINGROOM',
          waitingRoom
        })
        return waitingRoom
      })
  }
}