import './search.style.css'
import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ()=>(
    <div className='outer-box'>
    <Paper
      className='paper-box'
      component="form"
      sx={{ p: '4px 4px ', display: 'flex', alignItems: 'center', width: 400 , zIndex:500}}
    >
      <InputBase
        style={{fontSize:'15px'}}
        sx={{ ml: 1, flex: 1 }}
        placeholder="search..."
        inputProps={{ 'aria-label': 'search google maps' }}
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
    </Paper>
    </div>
)
export default SearchBar