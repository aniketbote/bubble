import { IconButton, Paper } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../Account/Account.context";
import timeDifference from "../../helper/time-difference";
import AnswerEditor from "../answerEditor/answerEditor.component";
import CommentSection from "../commentSection/commentSection.component";
import VoteComponent from "../vote/vote.component";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedIcon from '@mui/icons-material/Verified';
import './answerSection.style.css';

const AnswerSection = ({answer_ids, question_id,accepted_id}) =>{
    const [answers,setAnswers] = useState([]);
    const {session} = useContext(AccountContext);
    const [answerToEdit,setAnswerToEdit] = useState({});
    const user_id = session.idToken.payload.sub;
   useEffect(()=>{
     if(answer_ids.length>0)
     {
      fetch('https://****cs78h5.execute-api.us-east-1.amazonaws.com/v1/get_answer',{
        method:'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
          },
        body: JSON.stringify({answer_ids:answer_ids})
        })
        .then(response => response.json())
        .then(data => { setAnswers(data.filter(answer=>!answer.deleted))})
        .catch(err=>{console.log(err)})
     }else{
      setAnswers([])
     }
   },[answer_ids])
   const onEditButtonPress = (answer)=>{
      setAnswers(answers.filter((ans)=>ans!==answer))
      setAnswerToEdit(answer)
      document.getElementById('answer-editor-section').scrollIntoView({ behavior: 'smooth' })
   }
   const onDeleteButtonPress = (answer)=>{
    const data ={
      user_id: user_id,
      answer_id: answer.answer_id,
      parent_id: question_id,
      parent:'question'
    }
    if(window.confirm('Are you sure you want to delete this answer?')){
      fetch('https://****cs78h5.execute-api.us-east-1.amazonaws.com/v1/delete',{
        method:'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
          },
        body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(() => {setAnswers(answers.filter((ans)=>ans!==answer))})
        .catch(err=>{console.log(err)})
    }
 }

    return (
        <>
          {
          answers.length>0?<h3 style={{margin:'20px 10px 10px 10px'}}>{answers.length} {answers.length>1?<span>Answers</span>:<span>Answer</span>}</h3>:null}
              {
              answers
              .sort((a,b)=> parseInt(new Date(a.timestamp) - new Date(b.timestamp)))
              .sort((b,a)=> (a.upvotes-a.downvotes) - (b.upvotes-b.downvotes)) 
              .map((answer)=>{

                  return (<Paper id={answer.answer_id} elevation={4} key={answer.answer_id} style={{margin:'10px 0px', padding:'15px'}}  >
                            {user_id===answer.user_id && (answer.upvotes - answer.downvotes)<1 ?
                              <div style={{display:'flex',flexDirection:'row'}}>
                                  <div style={{flexGrow:1}}/>
                                    <IconButton title='Edit' onClick={()=>{onEditButtonPress(answer)}} >
                                        <EditIcon style={{color:'#003060'}} fontSize='large'/>
                                    </IconButton>
                                    <IconButton title='Delete' onClick={()=>{onDeleteButtonPress(answer)}} >
                                        <DeleteIcon style={{color:'#E7625F'}} fontSize='large'/>
                                    </IconButton>
                              </div>:null}
                              <div style={{display:'flex' ,flexDirection:'row'}}>
                                <div style={{display:'flex', flexDirection:'column'}}>
                                    <VoteComponent voteDisable={answer.user_id===user_id} type={"answer"} id={answer.answer_id} vote_count={answer.upvotes-answer.downvotes}/>
                                    {accepted_id===answer.answer_id?<VerifiedIcon style={{marginLeft:'7px',color:'#00b81f'}} fontSize="large"/>:<></>}
                                </div>
                                <div className="answer-div" dangerouslySetInnerHTML={{__html:answer.answer}}/>
                              </div>
                              <div className='answer-card-user' style={{display:'flex',marginTop:'20px',justifyContent:'right'}}>
                                  <p className='time-text'>answered by 
                                    <span className='user-text'> {answer.username}</span> {timeDifference(answer.timestamp)}.
                                    <span>{answer.edited? '(edited '+timeDifference(answer.edited_timestamp)+').':''}</span>
                                  </p>     
                              </div>
                              <CommentSection answer_id={answer.answer_id} comment_ids={answer.comment_ids}/>
                          </Paper>
                          )
              })}
        <Paper id='answer-editor-section' elevation={4}>
          <AnswerEditor setAnswerToEdit={setAnswerToEdit} answerToEdit={answerToEdit} answers={answers} setAnswers={setAnswers} question_id={question_id}/>
        </Paper>       
        </>
    )
}
export default AnswerSection;