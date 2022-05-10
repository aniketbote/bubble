import './questionPage.style.css';
import { useEffect, useState, useContext } from 'react';
import { Chip, Grid, IconButton, Paper } from '@mui/material';
import timeDifference from '../../helper/time-difference'
import AnswerSection from '../../components/answerSection/answerSection.component'
import CommentSection from '../../components/commentSection/commentSection.component';
import RelatedQuestions from '../../components/relatedQuestions/relatedQuestions.component';
import { AccountContext } from "../../Account/Account.context";
import { useParams } from 'react-router-dom';
import VoteComponent from '../../components/vote/vote.component';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const QuestionPage = ()=>{
    const {session} = useContext(AccountContext);
    const user_id = session.idToken.payload.sub;
    const [data,setData] = useState({})
    const {question_id} =useParams()
    useEffect(()=>{
        fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/get_question',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
              },
            body: JSON.stringify({question_id:question_id})
            })
            .then(response => response.json())
            .then(data => { console.log(data) ; setData(data)})
    },[question_id])
    
    return (
        <div className='content-column'>
            <div style={{display:'flex',flexDirection:'row',flexGrow:1}}>
                <div className='left-column' style={{flexDirection:'column',flexGrow:1}}>
                    {user_id===data.user_id?
                    <div style={{display:'flex',flexDirection:'row'}}>
                        <div style={{flexGrow:1}}/>
                            <IconButton title='Edit'>
                                <EditIcon style={{color:'#003060'}} fontSize='large'/>
                            </IconButton>
                            <IconButton title='Delete'>
                                <DeleteIcon style={{color:'#E7625F'}} fontSize='large'/>
                            </IconButton>
                         </div>:null}
                    <div style={{paddingLeft:'10px',flexGrow:1}}>
                        <h3>{data.question_title}</h3>
                        <p className='time-text'>Asked by <span className='user-text'>{data.username}</span> {timeDifference(data.timestamp)}.</p>       
                    </div>
                    <div className='horizontal-line' />
                    <Paper style={{padding:'20px',flexGrow:1}} elevation={4}> 
                        <div style={{display:'flex',flexDirection:'row'}}>
                            {data.upvotes!==undefined?<VoteComponent voteDisable={user_id===data.user_id} type={"question"} id={data.question_id} vote_count={data.upvotes-data.downvotes}/>:null}
                            <div className='description-div' dangerouslySetInnerHTML={{__html:data.question_description}}></div>
                        </div>
                        <Grid container spacing={1}>
                            {data.tags?data.tags.map(key => (
                                <Grid item key={key}>
                                    <Chip style={{fontSize:'12px'}} label={key} />
                                </Grid>)):null}
                        </Grid>
                        {data.comment_ids!==undefined?<CommentSection question_id={data.question_id} comment_ids={data.comment_ids}/>:null}
                    </Paper>
                    {data.answer_ids!==undefined?<AnswerSection accepted_id={data.accepted_id} question_id={data.question_id} answer_ids={data.answer_ids}/>:null}
                    </div>
                    <Paper elevation={6} className="right-column" >
                        {data.question_id!==undefined?<RelatedQuestions question_id={data.question_id}/>:null}
                    </Paper>
                </div>
            </div>
    )
}
export default QuestionPage;