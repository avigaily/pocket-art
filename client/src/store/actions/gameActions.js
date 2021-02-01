import gameService from '../../gameService.js';

export function loadGame(id) {
  return dispatch => {
    return gameService.getGame(id)
      .then(gameData => {
        dispatch({
          type: 'SET_GAME',
          gameData
        })
        return gameData
      })
  }
}

export function loadUser(name) {
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