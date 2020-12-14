import { DATA_LOADED } from '../constants/action-types';

const initialState = {
    news: []
};
  
function rootReducer(state = initialState, action) {
    switch (action.type) {
        case DATA_LOADED:
            return { ...state, news: action.payload.slice(0, 100)};
        default:
            return state;
    }
};
  
export default rootReducer;