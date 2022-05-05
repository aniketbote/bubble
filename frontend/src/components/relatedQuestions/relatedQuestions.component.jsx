import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import './relatedQuestions.style.scss';

const RelatedQuestions = ({question_id}) =>{
    const [questions,setQuestions] = useState([]);
    useEffect(()=>{
        fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/get_related_questions?q='+question_id,{
            method:'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
            }
            })
            .then(response => response.json())
            .then(data => {console.log(data) ; setQuestions(data)})
    },[question_id])
        
    return <div className="related-questions-div">
                <p className='header' >Related Questions</p>
                {
                    questions.length>0?
                    <ul className='related-list'>
                        {
                            questions.map((question)=>{
                                return  <li key={question.question_id} >
                                            <div style={{display:'flex'}}>
                                                <Chip style={{fontSize:'10px',paddingTop:'3px',minWidth:'40px'}} 
                                                      label={question.vote_count} 
                                                    color={question.accepted_answer!==""?"success":"warning"} size="small" variant="outlined" />
                                                <Link className="rel-question-link"  to={'/question/'+question.question_id}> {question.question_title} </Link> 
                                            </div>
                                            <div style={{height:'15px'}}/>
                                        </li>
                            })
                        }
                    </ul>:null
                    
                }
                
           </div>
}

export default RelatedQuestions;