import { combineReducers } from "redux";
import buttonGroupViewReducer from './buttonGroupViewReducer';
const reducers = combineReducers({
    buttonView : buttonGroupViewReducer
});

export default reducers;