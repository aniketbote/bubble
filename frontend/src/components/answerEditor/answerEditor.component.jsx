import { useContext, useEffect, useState } from "react";
import RichTextEditor from "../summernoteTextEditor/sumernoteTextEditor"
import { AccountContext } from "../../Account/Account.context";
import { Button } from "@mui/material";
const AnswerEditor= ({answers,setAnswers,question_id})=>{
    const [content,setContent] = useState('');
    const {session} = useContext(AccountContext);
    const [disableBtn,setDisableBtn]= useState(true);

    useEffect(()=>{
        if(content.replace( /(<([^>]+)>)/ig, '')
        .replace(/&nbsp;/gi,'')
        .replace(/\s/g ,'').length < 100 ){
            setDisableBtn(true)
        }
        else{
            setDisableBtn(false)
        }
    },[content])

   const postAnswer = ()=>{
        if(content.replace( /(<([^>]+)>)/ig, '')
                  .replace(/&nbsp;/gi,'')
                  .replace(/\s/g ,'').length < 100 ){return ;}
        const data={
                username: session.idToken.payload.preferred_username,
                user_id: session.idToken.payload.sub,
                answer: content,
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
                answer: content,
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
            <div style={{display:'flex'}}>
                <p style={{margin:'-10px 12px',paddingTop:'',background:'#FFFFE0',color:'#FF726F'}}>* Length of the answer must be at least 100 alphanumeric characters to submit the answer.</p>
            </div>
            <div style={{display:'flex',justifyContent:'right'}}>
                <Button disabled={disableBtn} onClick={postAnswer} style={{fontSize:'16px',margin:'-10px 10px 10px 5px'}} variant="contained">Submit</Button>
            </div>
        </>
    )
}
export default AnswerEditor;
