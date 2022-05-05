import './questionsList.style.css';
import SearchBar from '../../components/search/search.component';
import QuestionCard from '../../components/questionCard/questionCard.component';
import { useEffect, useState } from 'react';
import { Pagination } from '@mui/material';

const QuestionListPage = () => {
    const [questions,setQuestions] = useState([]);
    const [start,setStart] = useState(0);
    const [searchString,setSeatchString] = useState('');
    const [shouldSearch,setShouldSearch] = useState(false);
    const container = document.querySelector('.contentBar');
    useEffect(()=>{
            fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/get_latest_questions?start='+start,{
                method:'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*'
                  }            
                })
                .then(response => response.json())
                .then(data => {if (data.body.length > -1){
                    setQuestions(data.body) 
                    container.scrollTop = 0 ;
                }})
    },[start])

    return (
        <>
            <SearchBar/>
            <div style={{paddingTop:'15px'}} >
                <h3 style={{marginLeft:'15px'}}> Recent Questions</h3>
                <div style={{paddingTop:'15px'}}>
                    {questions.sort((a,b)=> parseInt(new Date(b.timestamp) - new Date(a.timestamp)))
                                .map((question)=> <QuestionCard question={question}  key={question.question_id}/>)}
                </div>
                <div style={{padding:'20px 0px'}}>
                         {questions.length>0?<Pagination onChange={(_,val)=>{setStart(val-1)}}  color='primary' count={25} size="large"/>:<></>}
                </div>
            </div>
        </>
    );
}

export default QuestionListPage;
