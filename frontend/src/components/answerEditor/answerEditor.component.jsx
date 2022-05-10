import { useContext, useEffect, useState } from "react";
import RichTextEditor from "../summernoteTextEditor/sumernoteTextEditor"
import { AccountContext } from "../../Account/Account.context";
import { Button } from "@mui/material";
const AnswerEditor= ({answers,setAnswers,question_id,answerToEdit,setAnswerToEdit})=>{
    const [content,setContent] = useState('');
    const {session} = useContext(AccountContext);
    const [disableBtn,setDisableBtn]= useState(true);
    const [reset,setReset] = useState(false); 
    useEffect(()=>{
        if(content.replace( /(<([^>]+)>)/ig, '')
        .replace(/&nbsp;/gi,'')
        .replace(/\s/g ,'').length < 20 ){
            setDisableBtn(true)
        }
        else{
            setDisableBtn(false)
        }
    },[content])



   const postAnswer = ()=>{
        if(content.replace( /(<([^>]+)>)/ig, '')
                  .replace(/&nbsp;/gi,'')
                  .replace(/\s/g ,'').length < 20 ){return ;}
        const data={
                username: session.idToken.payload.preferred_username,
                user_id: session.idToken.payload.sub,
                answer: content,
                question_id: question_id
            };

        if(Object.keys(answerToEdit).length > 0)
            data.answer_id = answerToEdit.answer_id;
        
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
                console.log(resData);
                const item={
                    answer_id: resData.answer_id,
                    answer: content,
                    username: data.username,
                    comment_ids:[],
                    downvotes:0,
                    upvotes:0,
                    user_id:data.user_id,
                    edited_timestamp: resData.timestamp
                }
                if(Object.keys(answerToEdit).length>0){
                    item.edited = true;
                    item.timestamp =answerToEdit.timestamp;
                    setAnswerToEdit({});
                }
                else{
                    item.edited = false;
                    item.timestamp = resData.timestamp
                }                    
                setAnswers([...answers,item]);
                setReset(true);
                setReset(false);
                setTimeout(()=>{
                    document.getElementById(resData.answer_id).scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'})
                },100)
            })
            }
            
    return ( 
        <>
            <h3 style={{margin:'15px',paddingTop:'15px'}}>Your Answer</h3>
            <RichTextEditor answerToEdit={answerToEdit} reset={reset} setContent={setContent} height={300}/>
            <div style={{display:'flex'}}>
                <p style={{margin:'-10px 12px',paddingTop:'',background:'#FFFFE0',color:'#FF726F'}}>* Length of the answer must be at least 20 alphanumeric characters to submit the answer.</p>
            </div>
            <div style={{display:'flex',justifyContent:'right'}}>
                <Button disabled={disableBtn} onClick={postAnswer} style={{fontSize:'16px',margin:'-10px 10px 10px 5px'}} variant="contained">Submit</Button>
            </div>
        </>
    )
}
export default AnswerEditor;
