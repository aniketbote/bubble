import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import timeDifference from "../../helper/time-difference";
import AnswerEditor from "../answerEditor/answerEditor.component";
import CommentSection from "../commentSection/commentSection.component";
const AnswerSection = ({answer_ids, question_id}) =>{
    const [answers,setAnswers] = useState([]);
   useEffect(()=>{
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
   },[answer_ids])
    return (
        <>
          {answers.length>0?<>
            <h3 style={{margin:'20px 10px 10px 10px'}}>{answers.length} {answers.length>1?<span>Answers</span>:<span>Answer</span>}</h3>
                {answers.map((answer)=>{
                    return (<Paper elevation={4} key={answer.answer_id} style={{margin:'5px 0px', padding:'15px'}}  >
                                <div dangerouslySetInnerHTML={{__html:answer.answer}}/>
                                <div className='answer-card-user' style={{display:'flex',marginTop:'20px',justifyContent:'right'}}>
                                    <p className='time-text'>answered by <span className='user-text'>{answer.username}</span> {timeDifference(answer.timestamp)}.</p>     
                                </div>
                                <CommentSection answer_id={answer.answer_id} comment_ids={answer.comment_ids}/>
                            </Paper>)
                })}
          </>:null}
        <Paper elevation={4}>
          <AnswerEditor question_id={question_id}/>
        </Paper>       
        </>
    )
}
export default AnswerSection;