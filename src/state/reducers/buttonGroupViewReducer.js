var Init_state = 'home';
const reducer = (state = Init_state,action) =>{
    switch(action.type){
        case 'SET_BUTTON_VIEW':
            return action.payload;
        default:
            return state;
    }
}
export default reducer;