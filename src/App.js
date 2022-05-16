import './App.css';
import {Route,Routes, Navigate, useLocation} from 'react-router-dom'; //also check Link, NavLink, Outlet
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
import QuestionListPage from './pages/questionsListPage/questionsList.component';
import BlogListPage from './pages/blogListPage/blogList.component';
import FAPPage from './pages/findAProfessor/findAProfessor.component';
import ProfessorPage from './pages/professorPage/professorPage.component';
import AddProfessor from './pages/addProfessor/addProfessor.component';
import AccountPage from './pages/accountPage/accountPage.component';

function App() {
  
  const {session,userStatus,setUserStatus,getSession,setSession} = useContext(AccountContext)
  const [shouldRender,setShouldRender] = useState(false);
  const location = useLocation();
  useEffect(()=>{
    getSession()
    .then((sess)=>{
      setSession(sess);
      setUserStatus(true);
      console.log(session);
    })
    .catch(()=>{setUserStatus(false)})
    .finally(()=>{setShouldRender(true)})
  },[])
  return (
    <div>
      <NavBar/>
      {shouldRender?
      <Routes>
          <Route exact  path="/"  element={userStatus?<BasePage/>:<Navigate replace to="login"/>}>
            <Route exact path="create_question" element={<QuestionCreationPage/>}/>
            <Route exact path="create_blog" element={<BlogCreationPage/>}/>
            <Route exact path="question/:question_id" element={<QuestionPage/>}/>
            <Route exact path="blog/:blog_id" element={<BlogPage/>}/>
            <Route exact path="" element={<HomePage/>}/>
            <Route exact path="home" element={<HomePage/>}/>
            <Route exact path="questions" element={<QuestionListPage/>}/>
            <Route exact path="blogs" element={<BlogListPage/>}/>
            <Route exact path="find_a_professor" element={<FAPPage/>}/>
            <Route exact path="professor/:id" element={<ProfessorPage/>}/>
            <Route exact path="add_professor" element={<AddProfessor/>}/>
            <Route exact path="account" element={<AccountPage/>}/>
            <Route  path="*" element={<ErrorPage/>}/>
          </Route>
          <Route exact  path="/login" element={!userStatus?<LoginSignupPage/>:<Navigate replace to="/"/>}/>

      </Routes>:null}
    </div> 
  )
}

export default App;
