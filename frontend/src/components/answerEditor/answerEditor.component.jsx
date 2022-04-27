import { useContext, useState } from "react";
import RichTextEditor from "../summernoteTextEditor/sumernoteTextEditor"
import { AccountContext } from "../../Account/Account.context";
import { Button } from "@mui/material";
const AnswerEditor= ({answers,setAnswers,question_id})=>{
    const [conetnt,setContent] = useState('');
    const {session} = useContext(AccountContext);
    console.log('question_id',question_id)
    console.log(session)

   const postAnswer = ()=>{
                const data={
                                username: session.idToken.payload.preferred_username,
                                user_id: session.idToken.payload.sub,
                                answer: conetnt,
                                question_id: question_id
                            };
                fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/post_answer',{
                    method:'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*'
                    },
                    body: JSON.stringify(data)
                    })
                    .then(response => response.json())
                    .then(resData => { 
                    const item={
                        answer_id: resData.answer_id,
                        answer: conetnt,
                        username: data.username,
                        comment_ids:[],
                        timestamp: resData.timestamp
                    }
                    setAnswers([...answers,item]);
                    })
            }
    return ( 
        <>
            <h3 style={{margin:'15px'}}>Your Answer</h3>
            <RichTextEditor setContent={setContent} height={300}/>
            <div style={{display:'flex',justifyContent:'right'}}>
                <Button onClick={postAnswer} style={{fontSize:'14px',margin:'-10px 10px 10px 5px'}} variant="contained">Submit</Button>
            </div>
        </>
    )
}
export default AnswerEditor;
