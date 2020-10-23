export const TokenAuth = `
mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
        token
        refreshToken
        payload
        refreshExpiresIn
    }
}`;

export const CheckIn = `
mutation CheckIn($appID: Int!){
  checkIn(appID: $appID){
    status
  }
}
`;
