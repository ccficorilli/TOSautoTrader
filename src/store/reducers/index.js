import { combineReducers } from 'redux';
import videoReducer from './videoReducer';

export default combineReducers({
   video: videoReducer
});

//8. import combineReducers and export defualt reducers
//9. import reducers and place in combineReducers
// GOTO ./videoReducer.js