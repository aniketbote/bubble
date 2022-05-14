import React, { Component } from 'react';
import ReactSummernote from 'react-summernote';
import CloseIcon from '@mui/icons-material/Close';
import { Paper } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import {Button} from '@mui/material';
import TextField from '@mui/material/TextField';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/tooltip';
import 'react-summernote/dist/react-summernote.scss' ; 
import 'bootstrap_v3/dist/css/bootstrap.css';
import './summernoteTextEditor.css';
import axios from 'axios';
import uuid from 'react-uuid';


class RichTextEditor extends Component {
  
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      viewImageUpload: false,
      imageTextField:'',
      className: 'class_'+uuid(),
      id: 'id_'+uuid(),
      insertEdit:true
    };
  }

  onChange = (content) => {
    if(content!==undefined){
      this.props.setContent(content);
    }
    else{
      this.props.setContent('');
    }
  }

  onInsertImage = ()=>{
    const input = document.querySelector(`#${this.state.id}`);
    if(input.files.length>0){
      const file = input.files[0];
      const headers = {
        'Content-Type': file.type,
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'PUT,OPTIONS',
        };
        const file_name = `${uuid()}_${file.name}`
        axios.put(`https://ig6dvmrlt3.execute-api.us-east-1.amazonaws.com/v1/upload/b2-ac9137/${file_name}`, file, {headers})
        .then(response => {
            this.editArea.innerHTML+= `<img src='https://b2-ac9137.s3.amazonaws.com/${file_name}'/>` ;
            this.props.setContent(this.editArea.innerHTML)
          })
          .catch(error => {
            console.error('There was an error!', error);
        });
    }
    else if(this.state.imageTextField!==''){
      this.editArea.innerHTML+= `<img src='${this.state.imageTextField}'/>` ;
      this.props.setContent(this.editArea.innerHTML)
      this.setState({imageTextField:''})
    }
    this.setState({ viewImageUpload: false})
  }
  componentDidUpdate(){
    if(this.props.reset){
      this.editArea.innerHTML = '';
      this.props.setContent('');
      if(!this.state.insertEdit)
        this.setState({insertEdit:true});
    }
    if(this.state.insertEdit){
      if(this.props.answerToEdit!==undefined){
        if(Object.keys(this.props.answerToEdit).length>0){
          this.editArea.innerHTML=this.props.answerToEdit.answer;
          this.props.setContent(this.props.answerToEdit.answer);
          this.setState({insertEdit:false});
        }
      }
      if(this.props.questionToEdit!==undefined){
        if(Object.keys(this.props.questionToEdit).length>0){
          this.editArea.innerHTML=this.props.questionToEdit.question_description;
          this.props.setContent(this.props.questionToEdit.question_description);
          this.setState({insertEdit:false});
        }
      }
      if(this.props.blogToEdit!==undefined){
        if(Object.keys(this.props.blogToEdit).length>0){
          this.editArea.innerHTML=this.props.blogToEdit.blog_content;
          this.props.setContent(this.props.blogToEdit.blog_content);
          this.setState({insertEdit:false});
        }
      }

    }

  }

  componentDidMount(){
    const toolBar = document.querySelector(`.${this.state.className} .note-insert`);
    const button = document.createElement('button');
    button.innerHTML = "<i class='note-icon-picture'> </i>";
    button.classList=["note-btn btn btn-default btn-sm"];
    button.onclick =  ()=>{this.setState({ viewImageUpload: true})};
    toolBar.appendChild(button);
    this.editArea=document.querySelector(`.${this.state.className} .note-editable`);


    this.ImageUpload = <Paper elevation={6} tabIndex="1" className='insert-upload-image'>
                    <div className="flex-container">
                      <div className='row-one'>
                        <div style={{flexGrow:1}}><p style={{fontSize:'20px',margin:'12px'}}>Insert Image</p></div>
                        <IconButton onClick={()=>{this.setState({ viewImageUpload: false})}}  aria-label="close" component="span">
                          <CloseIcon />
                        </IconButton>
                      </div>
                      <div style={{borderTop:'1px solid grey',margin:'5px'}}/>
                      <div className="row-two">
                        <p className='text-image'> UPLOAD IMAGE: </p>
                        <input style={{width:'100%',paddingBottom:'28px'}} type="file" accept='image/*' className="form-control" id={this.state.id} />
                      </div>
                      <div className='row-three' ><p className='text-image'> OR </p></div>
                      <div className="row-four">
                        <p className="text-image">&nbsp;&nbsp;&nbsp;&nbsp;IMAGE URL:</p>
                        <TextField style={{width:'100%'}} onChange={e=>this.setState({imageTextField:e.target.value})}  id="filled-basic" label="Image URL" variant="outlined"  />
                      </div>
                      
                      <div className="row-five"><Button onClick={this.onInsertImage} style={{fontSize:'12px'}} variant="contained">INSERT</Button></div>      
                  </div>
</Paper>
  }

 
  render() {
    
    return (
      <div className='outer-div'>
        {this.state.viewImageUpload? <div tabIndex={1} onClick={()=>{this.setState({ viewImageUpload: false})}} className='insert-upload-image-background' /> : null}
        {this.state.viewImageUpload? this.ImageUpload : null}
        <ReactSummernote
          className={this.state.className}
          options={{
            placeholder:this.props.placeholder,
            height: this.props.height,
            dialogsInBody: true,
            disableDragAndDrop: true,
            toolbar: [
              ['style', ['style']],
              ['font', ['bold', 'underline', 'clear']],
              ['script',['strikethrough', 'superscript', 'subscript']],
              ['fontname', ['fontname']],
              ['fontsize', ['fontsize']],
              ['color', ['color']],
              ['para', ['ul', 'ol','paragraph']],
              ['height', ['height']],
              ['table',['table']],
              ['insert', ['link']],
              ['view', ['fullscreen', 'codeview']]
            ]
          }}
          onChange={this.onChange}
          />
        </div>
    );
  }
}


export default RichTextEditor;

