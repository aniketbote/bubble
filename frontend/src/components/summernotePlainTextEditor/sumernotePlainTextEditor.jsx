import React, { Component } from 'react';
import ReactSummernote from 'react-summernote';
import uuid from 'react-uuid';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/tooltip';
import 'react-summernote/dist/react-summernote.scss' ; 
import 'bootstrap_v3/dist/css/bootstrap.css';
import './summernotePlainTextEditor.css';

class RichPlainTextEditor extends Component {
  constructor(props) {
    super(props);
    this.props = props
    this.state = {
      viewImageUpload: false,
      imageTextField:'',
      className:'class_'+uuid()
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
  componentDidMount(){
    this.editArea=document.querySelector(`.${this.state.className} .note-editable`)
  }
  
  componentDidUpdate(){
    if(this.props.reset){
      this.editArea.innerHTML = '';
      this.props.setContent('');
    }
  }
  render() {
    return (
        <ReactSummernote
          className={this.state.className}
          options={{
            placeholder:this.props.placeholder,
            height: this.props.height,
            dialogsInBody: true,
            disableDragAndDrop: true,
            toolbar: false
          }}
          onChange={this.onChange}
      />
    );
  }
}


export default RichPlainTextEditor;

