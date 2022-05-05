import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import {Grid} from '@mui/material';
import { Link } from 'react-router-dom';
import './questionCard.style.css';
import timeDifference from '../../helper/time-difference';

const QuestionCard = ({question}) =>{
    
    return (
    <Paper className='card' elevation={1}>
        <div className='col-1'>
            <p className='text'>{question.vote_count} votes</p>
            <p className='text'>{question.answer_count} answers</p>
            <p className='text'>{question.comment_count} comments</p>
        </div>
        <div className='vl'></div>
        <div className='col-2'>
            <div className='single-line'>
                <Link className='header-link' to={`/question/${question.question_id}`}><h4> {question.question_title} </h4> </Link>  
            </div>
            
            <Grid container spacing={1}>
                {question.tags.map(key => (
                    <Grid item key={key}>
                            <Chip style={{fontSize:'12px'}} label={key} />
                    </Grid>))}
            </Grid>
        </div>
        
        <div className='col-3'>
            <p> <span style={{color:'blue'}}> {question.username} </span> asked {timeDifference(question.timestamp)}</p>
        </div>
        
    </Paper>
);}

export default QuestionCard;