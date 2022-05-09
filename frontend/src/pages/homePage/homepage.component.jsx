import './homepage.style.css';
import SearchBar from '../../components/search/search.component';
import QuestionCard from '../../components/questionCard/questionCard.component';
import { useEffect, useState } from 'react';
import { Button, Pagination } from '@mui/material';
import { useNavigate } from 'react-router';
import BlogCard from '../../components/blogCard/blogCard.component';

const QuestionListPage = () => {
    const [content,setContent] = useState([]);
    const [start,setStart] = useState(0);
    const [searchString,setSearchString] = useState('');
    const [searched,setSearched] = useState(false);
    const [forceLoad,setForceLoad] = useState(false);
    const [noSearchResults,setNoSearchResults] = useState(false)

    const navigate = useNavigate();

    const container = document.querySelector('.contentBar');

    useEffect(()=>{
        fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/latest_feeds?start='+start,{
            method:'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
                }            
            })
            .then(response => response.json())
            .then(data => {console.log(data); if (data.body.length > 0){
                setContent(data.body) 
                if(container!==null){
                    container.scrollTop = 0 ;
                }
            }})
    },[start,forceLoad])

    const get_search_results = ()=>{
        if(searchString!==''){
            setSearched(true)
            fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/search_generic_query?search_string='+searchString,{
                method:'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*'
                    }            
                })
                .then(response => response.json())
                .then(data => {
                    if (data.body.length > 0){
                        setContent(data.body) 
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

    return (
        <>
            <SearchBar setSearchString={setSearchString} get_search_results={get_search_results}/>
            <div style={{paddingTop:'15px'}} >
                <div style={{display:'flex', flexDirection:'row'}}>
                    <h3 style={{marginLeft:'15px',flexGrow:1}}>
                        {searched?<span>Searched feed Results - <span style={{color:'blue'}}>{searchString}</span></span>
                        : 'Recent Feeds'} </h3>
                        <Button style={{fontSize:'14px',marginRight:'20px'}} 
                                variant='text'
                                onClick={()=>{navigate('/create_question')}}>ASK A QUESTION</Button>
                        <Button style={{fontSize:'14px',marginRight:'20px'}} 
                                variant='text'
                                onClick={()=>{navigate('/create_blog')}}>POST A BLOG</Button>
                </div>
                <div style={{paddingTop:'15px'}}>
                    {content.sort((a,b)=> parseInt(new Date(b.timestamp) - new Date(a.timestamp)))
                                .map((item)=> {
                                    if(item.question_id!==undefined){
                                        return <QuestionCard question={item}  key={item.question_id}/>
                                    }
                                    else{
                                        return <BlogCard blog={item}  key={item.blog_id}/>
                                    }
                                })}
                </div>
                <div style={{padding:'20px 0px'}}>
                         {content.length>0 && !searched ?<Pagination onChange={(_,val)=>{setStart(val-1)}}  color='primary' count={start+5} size="large"/>:<></>}
                </div>
            </div>
        </>
    );
}

export default QuestionListPage;
