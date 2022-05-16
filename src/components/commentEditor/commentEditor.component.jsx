import RichPlainTextEditor from "../summernotePlainTextEditor/sumernotePlainTextEditor"
import { Button } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import { AccountContext } from "../../Account/Account.context";

const CommentEditor = ({question_id,answer_id,blog_id,comments,setComments})=>{
    const [showCommentEditor,setShowCommentEditor] = useState(false);
    const [content,setContent] = useState('');
    const {session} = useContext(AccountContext);
    const [disableBtn,setDisableBtn]= useState(true);
    const [reset,setReset] = useState(false);
    useEffect(()=>{
        if(content.replace( /(<([^>]+)>)/ig, '')
        .replace(/&nbsp;/gi,'')
        .replace(/\s/g ,'').length < 10 ){
            setDisableBtn(true)
        }
        else{
            setDisableBtn(false)
        }
    },[content])


    
    const post_comment = () =>{
        if(content.replace( /(<([^>]+)>)/ig, '')
                  .replace(/&nbsp;/gi,'')
                  .replace(/\s/g ,'').length < 10 ){return ;}

        var data={
            username: session.idToken.payload.preferred_username,
            user_id: session.idToken.payload.sub,
            comment_content: content.replace( /(<([^>]+)>)/ig, '')
        };                            

        if(question_id!==undefined){
            data.question_id = question_id;
        }
        else if(answer_id!==undefined){
            data.answer_id = answer_id;
        }
        else if(blog_id!==undefined){
            data.blog_id = blog_id;
        }
        fetch('https://****cs78h5.execute-api.us-east-1.amazonaws.com/v1/post_comment',{
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
                    comment_id: resData.comment_id,
                    comment_content: data.comment_content,
                    username: data.username,
                    timestamp: resData.timestamp,
                    user_id:data.user_id
                }
                setComments([...comments,item]);
                setReset(true);
                setReset(false);
                setShowCommentEditor(false);
                })
            .catch(err=>{console.log(err)})

    }
    return(<>
        <Button onClick={()=>{setShowCommentEditor(true)}} style={{fontSize:'12px',marginBottom:'5px'}} variant="text">add a comment</Button>
        {showCommentEditor?<>
            <RichPlainTextEditor reset={reset}  setContent={setContent}  height={100}/>
            <div style={{display:'flex'}}>
                <p style={{margin:'-10px 0px',paddingTop:'',background:'#FFFFE0',color:'#FF726F'}}>* Length of the comment must be at least 10 alphanumeric characters to submit the comment.</p>
            </div>
            <div style={{display:'flex',justifyContent:'right'}}>
                <Button disabled={disableBtn} onClick={post_comment} style={{fontSize:'12px',marginTop:'-10px'}} variant="contained">Submit</Button>
            </div>
        </>:null}
    </>)
}
export default CommentEditor;