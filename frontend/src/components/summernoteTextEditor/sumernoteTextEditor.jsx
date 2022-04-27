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

var editArea;

class RichTextEditor extends Component {
  
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      viewImageUpload: false,
      imageTextField:''
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
    const input = document.querySelector('#customImage');
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
            editArea.innerHTML+= `<p><img src='https://b2-ac9137.s3.amazonaws.com/${file_name}'/></p>` ;
            this.props.setContent(editArea.innerHTML)
          })
          .catch(error => {
            console.error('There was an error!', error);
        });
    }
    else if(this.state.imageTextField!==''){
      editArea.innerHTML+= `<p><img src='${this.state.imageTextField}'/></p>` ;
      this.props.setContent(editArea.innerHTML)
      this.setState({imageTextField:''})
    }
    this.setState({ viewImageUpload: false})
  }

  componentDidMount(){
    const toolBar = document.querySelector('.note-insert');
    const button = document.createElement('button');
    button.innerHTML = "<i class='note-icon-picture'> </i>";
    button.classList=["note-btn btn btn-default btn-sm"];
    button.onclick =  ()=>{this.setState({ viewImageUpload: true})};
    toolBar.appendChild(button);
    editArea=document.querySelector('.note-editable')
    editArea.innerHTML='';
  }

  ImageUpload = <Paper elevation={6} tabIndex="1" className='insert-upload-image'>
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
                      <input style={{width:'100%',paddingBottom:'28px'}} type="file" accept='image/*' className="form-control" id="customImage" />
                    </div>
                    <div className='row-three' ><p className='text-image'> OR </p></div>
                    <div className="row-four">
                      <p className="text-image">&nbsp;&nbsp;&nbsp;&nbsp;IMAGE URL:</p>
                      <TextField style={{width:'100%'}} onChange={e=>this.setState({imageTextField:e.target.value})}  id="filled-basic" label="Image URL" variant="outlined"  />
                    </div>
                    
                    <div className="row-five"><Button onClick={this.onInsertImage} style={{fontSize:'12px'}} variant="contained">INSERT</Button></div>      
                  </div>
              </Paper>
  render() {
    
    return (
      <div className='outer-div'>
        {this.state.viewImageUpload? <div tabIndex={1} onClick={()=>{this.setState({ viewImageUpload: false})}} className='insert-upload-image-background' /> : null}
        {this.state.viewImageUpload? this.ImageUpload : null}
        <ReactSummernote
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

