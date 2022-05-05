import './questionsList.style.css';
import SearchBar from '../../components/search/search.component';
import QuestionCard from '../../components/questionCard/questionCard.component';
import { useEffect, useState } from 'react';
import { Pagination } from '@mui/material';

const QuestionListPage = () => {
    const [questions,setQuestions] = useState([]);
    const [start,setStart] = useState(0);
    const [searchString,setSearchString] = useState('');
    const [searched,setSearched] = useState(false);
    const container = document.querySelector('.contentBar');
    const [forceLoad,setForceLoad] = useState(false);

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
    },[start,forceLoad])

    const get_search_results = ()=>{
        if(searchString!==''){
            setSearched(true)
            fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/search_question?search_string='+searchString,{
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
        }
        else{
            setForceLoad(!forceLoad);
            setSearched(false);
        }
    }

    return (
        <>
            <SearchBar setSearchString={setSearchString} get_search_results={get_search_results}/>
            <div style={{paddingTop:'15px'}} >
                <h3 style={{marginLeft:'15px'}}>{searched?'Searched Question Results':'Recent Questions'} </h3>
                <div style={{paddingTop:'15px'}}>
                    {questions.sort((a,b)=> parseInt(new Date(b.timestamp) - new Date(a.timestamp)))
                                .map((question)=> <QuestionCard question={question}  key={question.question_id}/>)}
                </div>
                <div style={{padding:'20px 0px'}}>
                         {questions.length>0 && !searched ?<Pagination onChange={(_,val)=>{setStart(val-1)}}  color='primary' count={25} size="large"/>:<></>}
                </div>
            </div>
        </>
    );
}

export default QuestionListPage;
