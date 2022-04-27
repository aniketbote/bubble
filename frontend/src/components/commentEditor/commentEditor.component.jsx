import RichPlainTextEditor from "../summernotePlainTextEditor/sumernotePlainTextEditor"
import { Button } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import { AccountContext } from "../../Account/Account.context";

const CommentEditor = ({question_id,answer_id,blog_id,comments,setComments})=>{
    const [showCommentEditor,setShowCommentEditor] = useState(false);
    const [content,setContent] = useState('');
    const {session} = useContext(AccountContext);
    const [disableBtn,setDisableBtn]= useState(true);

    useEffect(()=>{
        if(content.replace( /(<([^>]+)>)/ig, '')
        .replace(/&nbsp;/gi,'')
        .replace(/\s/g ,'').length < 80 ){
            setDisableBtn(true)
        }
        else{
            setDisableBtn(false)
        }
    },[content])

    const post_comment = () =>{
        if(content.replace( /(<([^>]+)>)/ig, '')
                  .replace(/&nbsp;/gi,'')
                  .replace(/\s/g ,'').length < 80 ){return ;}

        if(question_id!==undefined){
            console.log('question');
        }
        else if(answer_id!==undefined){
            console.log('answer')
        }
    }
    return(<>
        <Button onClick={()=>{setShowCommentEditor(true)}} style={{fontSize:'12px',marginBottom:'5px'}} variant="text">add a comment</Button>
        {showCommentEditor?<>
            <RichPlainTextEditor setContent={setContent}  height={100}/>
            <div style={{display:'flex'}}>
                <p style={{margin:'-10px 0px',paddingTop:'',background:'#FFFFE0',color:'#FF726F'}}>* Length of the comment must be at least 80 alphanumeric characters to submit the comment.</p>
            </div>
            <div style={{display:'flex',justifyContent:'right'}}>
                <Button disabled={disableBtn} onClick={post_comment} style={{fontSize:'14px',marginTop:'-10px'}} variant="contained">Submit</Button>
            </div>
        </>:null}
    </>)
}
export default CommentEditor;