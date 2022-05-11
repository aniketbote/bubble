import './questionsList.style.css';
import SearchBar from '../../components/search/search.component';
import QuestionCard from '../../components/questionCard/questionCard.component';
import { useEffect, useState } from 'react';
import { Button, CircularProgress, Pagination } from '@mui/material';
import { useNavigate } from 'react-router';

const QuestionListPage = () => {
    const [questions,setQuestions] = useState([]);
    const [start,setStart] = useState(0);
    const [searchString,setSearchString] = useState('');
    const [searched,setSearched] = useState(false);
    const [forceLoad,setForceLoad] = useState(false);
    const [noSearchResults,setNoSearchResults] = useState(false)

    const navigate = useNavigate();

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
            .then(data => {if (data.body.length > 0){
                setQuestions(data.body) 
                if(container!==null){
                    container.scrollTop = 0 ;
                }
            }})
    },[start,forceLoad,container])

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
                .then(data => {
                    if (data.body.length > 0){
                        setQuestions(data.body) 
                        container.scrollTop = 0 ;
                    }
                    else{
                        setNoSearchResults(true)
                    }
                })
        }
        else{
            setForceLoad(!forceLoad);
            setSearched(false);
        }
    }

    if(noSearchResults){
        return(
            <div style={{padding:'15px'}}>
                <h3>No search results found - <span style={{color:'blue'}}>{searchString}</span> </h3>
                <h4> Search Suggestions</h4>
                <ul>
                    <li> Check your spelling.</li>
                    <li> Try more general words.</li>
                    <li> Try different words that mean the same thing.</li>
                </ul>
                <Button style={{fontSize:'small'}} 
                        variant='text' 
                        size='large'
                        onClick={()=>{setSearchString('');setSearched(false);setNoSearchResults(false)}}> get back to recent questions </Button>
            </div>
        )
    }

    if(questions.length<1)
        return <div style={{display:'flex',flexDirection:'row',flexGrow:1,justifyContent:'center',paddingTop:'20px'}}><CircularProgress /></div>

    return (
        <>
            <SearchBar setSearchString={setSearchString} get_search_results={get_search_results}/>
            <div style={{paddingTop:'15px'}} >
                <div style={{display:'flex', flexDirection:'row'}}>
                    <h3 style={{marginLeft:'15px',flexGrow:1}}>
                        {searched?<span>Searched Question Results - <span style={{color:'blue'}}>{searchString}</span></span>
                        : 'Recent Questions'} </h3>
                        <Button style={{fontSize:'14px',marginRight:'20px'}} 
                                size='' 
                                variant='text'
                                onClick={()=>{navigate('/create_question')}}>ASK A QUESTION</Button>
                </div>
                <div style={{paddingTop:'15px'}}>
                    {questions.sort((a,b)=> parseInt(new Date(b.timestamp) - new Date(a.timestamp)))
                                .map((question)=> <QuestionCard question={question}  key={question.question_id}/>)}
                </div>
                <div style={{padding:'20px 0px'}}>
                         {questions.length>0 && !searched ?<Pagination onChange={(_,val)=>{setStart(val-1)}}  color='primary' count={start+5} size="large"/>:<></>}
                </div>
            </div>
        </>
    );
}

export default QuestionListPage;
