import RichTextEditor from '../../components/summernoteTextEditor/sumernoteTextEditor';
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import {Autocomplete, Grid, TextField} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import DOMPurify from 'dompurify';
import './blogCreation.style.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { AccountContext } from '../../Account/Account.context';
import { actionCreators } from '../../state';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
      marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
      border: '1px solid #ced4da',
      fontSize: 16,
      width: '100%',
      padding: '10px 12px',
      transition: theme.transitions.create([
        'border-color',
        'background-color',
        'box-shadow',
      ]),
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),

      '&:focus': {
        boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
        borderColor: theme.palette.primary.main,
      },
    },
  }));

const BlogCreationPage = ()=>{

    const [title,setTitle] = useState('');
    const [content,setContent] = useState('');
    const [tags,setTags] = useState([]);
    const [tagText,setTagText] = useState('');
    const [apiTagsList,setApiTagsList] = useState([]);
    const [blogToEdit,setBlogToEdit] = useState({});
    const [disableButton,setDisableButton] = useState(true);
    const {session} = useContext(AccountContext);
    const user_id = session.idToken.payload.sub;
    const username = session.idToken.payload.preferred_username;
    const location = useLocation();
    const navigate = useNavigate();
    const {state} = location;

    const dispatch = useDispatch();
    useEffect(()=>{
        const {setButtonGroupView} = bindActionCreators(actionCreators,dispatch);
        setButtonGroupView('blogs')
    },[])

    var data = {
      user_id: user_id
    };

    useEffect(()=>{
      if(state!==null){
        setContent(state.blog_description);
        setTitle(state.blog_title);
        setTags(state.tags);
        setBlogToEdit(state)
      }
    },[state])

    useEffect(()=>{
      if(content.replace( /(<([^>]+)>)/ig, '').replace(/&nbsp;/gi,'').replace(/\s/g ,'').length > 20
         && title.length>10)
      {
          setDisableButton(false);
      }
      else{
          setDisableButton(true);
      }

    },[content,title])

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        const tagTextValue = e.target.value.replace(/\s/g, '');
        setTags([...new Set([...tags, ...tagTextValue.split(/[,;]+/)].map(x=>x.toLowerCase()))]);
        setTagText('');
      }
    }
    const handleDelete = (key) => {
     setTags(tags.filter(item => item !== key));
    };

    const addTag = (value)=>{
      const tagTextValue = value;
      if(value!==null){
        setTags([...new Set([...tags, ...tagTextValue.split(/[,;]+/)].map(x=>x.toLowerCase()))]);
      }
      console.log(document.querySelector('#combo-box-question').value)
      setTagText('');
    };
    const makeTagsApiCall = (val)=>{
      fetch('https://api.stackexchange.com/2.3/tags?pagesize=10&order=desc&sort=popular&site=stackoverflow&inname='+val.toLowerCase())
          .then(response=>response.json())
          .then(data=> setApiTagsList(data.items.map(x=>x.name)))
    }

    const handleSubmit = ()=>{
      data.username = username;
      data.blog_title = title;
      data.blog_content = content;
      data.tags = tags;
      if(state!==null)
        data.blog_id = state.blog_id;
      console.log(data)
      fetch('http://3.239.217.225:8080/blog',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*',
              },
            body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {navigate('/blog/'+data.blog_id) })
            .catch(err=>console.log(err))
    }

    return (
            <div style={{display:'flex',flexDirection:'column',marginTop:'15px'}}>                    
                <div style={{display:'flex',marginLeft:'10px'}}> 
                    <InputLabel htmlFor="bootstrap-input">
                        <span style={{fontSize:'16px',fontWeight:'bolder'}}>Title:&nbsp;</span>
                    </InputLabel>
                </div>
                <div style={{marginLeft:'10px'}}> 
                        <BootstrapInput id='bootstrap-input-title' value={title} onChange={e => setTitle(e.target.value)} placeholder='Title'  /> 
                </div>
                <div style={{display:'flex',marginLeft:'10px',marginTop:'15px'}}> 
                    <InputLabel htmlFor="bootstrap-input">
                        <span style={{fontSize:'16px',fontWeight:'bolder'}}>Body:&nbsp;</span>
                    </InputLabel>
                </div>
                <RichTextEditor blogToEdit={blogToEdit} setContent={setContent} height={400}/>                
                {false?<div className='contentDiv' dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(content)}}></div>:null}
                <div style={{display:'flex',marginLeft:'10px'}}> 
                    <InputLabel htmlFor="bootstrap-input">
                        <span style={{fontSize:'16px',fontWeight:'bolder'}}>Tags:&nbsp;</span>
                    </InputLabel>
                </div>
                <div style={{marginLeft:'10px',marginBottom:'10px'}}> 

                  <Autocomplete
                    disablePortal
                    size={"large"}
                    id="combo-box-question"
                    options={apiTagsList}
                    sx={{ width: 300 }}
                    onChange={( _ , value ) => addTag(value)}
                    renderInput={(params) => <TextField {...params} variant='filled' value={tagText}  onChange={(e)=>{setTagText(e.target.value);makeTagsApiCall(e.target.value)}}  onKeyDown={handleKeyDown}  label="Tags" />}
                />      
                </div>
                <div style={{marginLeft:'10px'}}> 
                  <Grid container spacing={1}>
                  {tags.map(key => (
                      <Grid item key={key}>
                              <Chip onDelete={()=>{handleDelete(key)}} style={{fontSize:'12px'}} label={key} />
                      </Grid>))}
                  </Grid>                
                </div>
                <div style={{margin:'10px'}}><Button disabled={disableButton} onClick={handleSubmit} style={{fontSize:'12px'}} variant="contained">Submit Blog</Button></div>
            </div>
            )
}
export default BlogCreationPage;