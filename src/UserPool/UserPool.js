import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId:'us-east-1_********',
    ClientId:"#####4bnq3nk43l5p#######"
};

export default new CognitoUserPool(poolData);