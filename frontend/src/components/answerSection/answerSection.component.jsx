import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import timeDifference from "../../helper/time-difference";
import AnswerEditor from "../answerEditor/answerEditor.component";
import CommentSection from "../commentSection/commentSection.component";
import VoteComponent from "../vote/vote.component";
import './answerSection.style.css';
const AnswerSection = ({answer_ids, question_id}) =>{
    const [answers,setAnswers] = useState([]);
   useEffect(()=>{
     if(answer_ids.length>0)
     {
      fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/get_answer',{
        method:'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
          },
        body: JSON.stringify({answer_ids:answer_ids})
        })
        .then(response => response.json())
        .then(data => { setAnswers(data)})
        .catch(err=>{console.log(err)})
     }else{
      setAnswers([])
     }
   },[answer_ids])
    
    return (
        <>
          {answers.length>0?<h3 style={{margin:'20px 10px 10px 10px'}}>{answers.length} {answers.length>1?<span>Answers</span>:<span>Answer</span>}</h3>:null}
              {
              answers.sort((a,b)=> parseInt(new Date(a.timestamp) - new Date(b.timestamp)))
              .map((answer)=>{
                  return (<Paper elevation={4} key={answer.answer_id} style={{margin:'10px 0px', padding:'15px'}}  >
                              <div style={{display:'flex' ,flexDirection:'row'}}>
                                <VoteComponent type={"answer"} id={answer.answer_id} vote_count={answer.upvotes-answer.downvotes}/>
                                <div className="answer-div" dangerouslySetInnerHTML={{__html:answer.answer}}/>
                              </div>
                              <div className='answer-card-user' style={{display:'flex',marginTop:'20px',justifyContent:'right'}}>
                                  <p className='time-text'>answered by <span className='user-text'>{answer.username}</span> {timeDifference(answer.timestamp)}.</p>     
                              </div>
                              <CommentSection answer_id={answer.answer_id} comment_ids={answer.comment_ids}/>
                          </Paper>
                          )
              })}
        <Paper elevation={4}>
          <AnswerEditor answers={answers} setAnswers={setAnswers} question_id={question_id}/>
        </Paper>       
        </>
    )
}
export default AnswerSection;