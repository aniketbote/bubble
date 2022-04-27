import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId:'us-east-1_sKa7hGbo8',
    ClientId:"57bsf4bnq3nk43l5p123noight"
};

export default new CognitoUserPool(poolData);