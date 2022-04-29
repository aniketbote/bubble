import './App.css';
import {Route,Routes, Navigate} from 'react-router-dom'; //also check Link, NavLink, Outlet
import HomePage from './pages/homePage/homepage.component';
import LoginSignupPage from './pages/loginSignupPage/loginSignup.component';
import ErrorPage from './pages/errorPage/errorpage.component';
import NavBar from './components/navbar/navbar.component';
import { AccountContext } from './Account/Account.context';
import { useContext, useEffect, useState } from 'react';
import BasePage from './pages/basePage/basePage.component';
import QuestionCreationPage from './pages/questionCreationPage/questionCreation.component';
import BlogCreationPage from './pages/blogCreationPage/blogCreation.component';
import QuestionPage from './pages/questionPage/questionPage.component';
import BlogPage from './pages/blogPage/blogPage.component';
function App() {
  
  const {userStatus,setUserStatus,getSession,setSession} = useContext(AccountContext)
  const [shouldRender,setShouldRender] = useState(false);
  useEffect(()=>{
    getSession()
    .then((session)=>{setSession(session);setUserStatus(true)})
    .catch(()=>{setUserStatus(false)})
    .finally(()=>{setShouldRender(true)})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <div>
      <NavBar/>
      {shouldRender?
      <Routes>
          <Route exact  path="/"  element={userStatus?<BasePage/>:<Navigate replace to="login"/>}>
            <Route exact path="create_question" element={<QuestionCreationPage/>}/>
            <Route exact path="create_blog" element={<BlogCreationPage/>}/>
            <Route exact path="question" element={<QuestionPage/>}/>
            <Route exact path="blog" element={<BlogPage/>}/>
            <Route exact path="" element={<HomePage/>}/>
          </Route>
          <Route exact  path="/login" element={!userStatus?<LoginSignupPage/>:<Navigate replace to="/"/>}/>
          <Route  path="*" element={<ErrorPage/>}/>
      </Routes>:null}
    </div> 
  )
}

export default App;
