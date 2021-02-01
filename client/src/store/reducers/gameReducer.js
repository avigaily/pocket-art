const initialState = {
    user: null,
    waitingRoom: null,
    gameData: null
};

export default function GameReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.user
            }
        case 'SET_GAME':
            return {
                ...state,
                gameData: action.gameData
            }
        case 'SET_WAITINGROOM':
            return {
                ...state,
                waitingRoom: action.waitingRoom
            }
        // case 'UPDATE_WAITINGROOM':
        //     return {
        //         ...state,
        //         waitingRoom: { ...state.waitingRoom, [action.opponenet.id]: action.opponenet }
        //     }
        default:
            return state;
    }
}