import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import {Grid} from '@mui/material';
import { Link } from 'react-router-dom';
import './questionCard.style.css';

const QuestionCard = () =>{
    
    const tags = ['react','react-native','react.js','javascript','typescript']
    
    return (
    <Paper className='card' elevation={1}>
        <div className='col-1'>
            <p className='text'>{5} votes</p>
            <p className='text'>{2} answers</p>
            <p className='text'>{1} comments</p>
        </div>
        <div className='vl'></div>
        <div className='col-2'>
            <div className='single-line'>
                <Link className='header-link' to={''}><h4>How can I solve this error, I don't understand what is happening? </h4> </Link>  
            </div>
            
            <Grid container spacing={1}>
                {tags.map(key => (
                    <Grid item key={key}>
                            <Chip style={{fontSize:'12px'}} label={key} />
                    </Grid>))}
            </Grid>
        </div>
        
        <div className='col-3'>
            <p> <span style={{color:'blue'}}> {'Henna'} </span> asked 5 minutes ago</p>
        </div>
        
    </Paper>
);}

export default QuestionCard;