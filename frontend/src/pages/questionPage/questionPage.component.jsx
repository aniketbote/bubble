import './questionPage.style.css';
import { useEffect, useState,useContext } from 'react';
import { Chip, Grid, Paper } from '@mui/material';
import timeDifference from '../../helper/time-difference'
import { AccountContext } from '../../Account/Account.context';
import AnswerSection from '../../components/answerSection/answerSection.component'
import CommentSection from '../../components/commentSection/commentSection.component';
const QuestionPage = ()=>{
    const {session} = useContext(AccountContext)
    const [data,setData] = useState({})

    useEffect(()=>{
        fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/get_question',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
              },
            body: JSON.stringify({question_id:"d2672cb7c47e4b20ab6992639fc17c6d"})
            })
            .then(response => response.json())
            .then(data => { setData(data)})
    },[])
    console.log(data)
    return (
        <div className='answerPageContainer'>
                <div className='content-column'>
                    <div style={{paddingLeft:'10px'}}>
                        <h3>{data.question_title}</h3>
                        <p className='time-text'>Asked by <span className='user-text'>{data.username}</span> {timeDifference(data.timestamp)}.</p>       
                    </div>
                    <div className='horizontal-line' />
                    <Paper style={{padding:'20px'}} elevation={4}>
                        <div className='description-div' dangerouslySetInnerHTML={{__html:data.question_description}}></div>
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
                <div className='right-column'>  
                    <Paper elevation={8} style={{minHeight:'100%'}} >
                    </Paper>
                </div>
        </div>     
    )
}
export default QuestionPage;