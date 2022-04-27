import { useContext, useState } from "react";
import RichTextEditor from "../summernoteTextEditor/sumernoteTextEditor"
import { AccountContext } from "../../Account/Account.context";
const AnswerEditor= ({question_id})=>{
    const [conetnt,setContent] = useState('');
    const {session} = useContext(AccountContext);
    console.log('question_id',question_id)
    return ( 
        <>
            <h3 style={{margin:'15px'}}>Your Answer</h3>
            <RichTextEditor setContent={setContent} height={300}/>
        </>
    )
}
export default AnswerEditor;
