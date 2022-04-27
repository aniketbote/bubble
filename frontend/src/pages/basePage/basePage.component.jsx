import {Outlet} from 'react-router-dom';
import { ButtonMenu } from '../../components/buttonMenu/buttonMenu.component';
import  './basePage.style.css';

const BasePage = () => 
<>
<div className='baseDiv' >
  <div className='buttonBar'>
    <center> <ButtonMenu /> </center>
  </div>
  <div className='contentBar' > <Outlet/></div>
</div>
</>

export default BasePage;
