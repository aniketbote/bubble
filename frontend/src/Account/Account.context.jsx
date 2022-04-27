import React,{createContext, useState} from 'react';
import UserPool from '../UserPool/UserPool';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const AccountContext = createContext();

const Account = ({children}) => {

    const [userStatus,setUserStatus] = useState(false);
    const [session,setSession] = useState({});

    const getSession =  () =>
     new Promise((resolve, reject) => {
      const user = UserPool.getCurrentUser();
      if (user) {
        user.getSession((err, session) => {
          if (err) {
            reject();
          } else {
            resolve(session);
          }
        });
      } else {
        reject();
      }
    });

    const authenticate =  (Username, Password) =>   //Here Username is email
          new Promise((resolve,reject)=>{
            console.log(UserPool);
            const user = new CognitoUser({ 
                Username: Username, 
                Pool: UserPool 
            });

            const authDetails = new AuthenticationDetails({ Username, Password });

            user.authenticateUser(authDetails,{
                onSuccess: data => {
                    resolve(data)
                },
                onFailure: err => {
                    console.log(err)
                    reject(err);
                },
                newPasswordRequired: data =>{
                    console.log(data)
                    resolve(data)
                }
            });
       })
    
    const logout = () => {
        const user = UserPool.getCurrentUser();
        if (user) {
          setUserStatus(false);
          user.signOut();
        }
      }
    return ( <AccountContext.Provider value={{authenticate, logout, getSession, userStatus, setUserStatus, session, setSession}}>
        {children}
    </AccountContext.Provider> )
}
export {Account,AccountContext};