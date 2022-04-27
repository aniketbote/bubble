import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import './buttonMenu.style.css'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../state';



export const ButtonMenu = () => {
  const view = useSelector(state=>state.buttonView);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {setButtonGroupView} = bindActionCreators(actionCreators,dispatch);

  const buttons = [
    <ToggleButton onClick={()=>{ navigate('/')}}  value="home" className='gray-button' key="home">Home</ToggleButton>,
    <ToggleButton onClick={()=>{ navigate('/create_question')}}  value="questions" className='gray-button' key="question">Questions</ToggleButton>,
    <ToggleButton  onClick={()=>{ navigate('/create_blog')}}  value="blogs" className='gray-button' key="blog">Blogs</ToggleButton>,
    <ToggleButton  value="FAP" className='gray-button' key="professor">Find a professor</ToggleButton>,
  ];

  const handleChange = (event, nextView) => {
    if (nextView !== null){
      setButtonGroupView(nextView);
    }
  };
  return (
    <Box className='button-box' >
      <ToggleButtonGroup
        orientation="vertical"
        className='button-group'
        value={view}
        exclusive
        aria-label="vertical outlined button group dark" 
        onChange={handleChange}
       >
        {buttons}
      </ToggleButtonGroup>
    </Box>
  );
}