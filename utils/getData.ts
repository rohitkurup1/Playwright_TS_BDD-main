import path from 'path';

function getProjectRoot(): string {
    return path.join(__dirname, '..');
}

function getUserData(userName: string): any {
    const rootDirectory = getProjectRoot();
    const userDataFilePath = path.join(rootDirectory, 'test_data', 'user_data.json');
    const data = require(userDataFilePath);
    const userData = data[userName];
    console.log(`User Data for ${userName} is: ${JSON.stringify(userData)}`);
    return userData;
}

function getCredentialsData(environment: string): any {
    const rootDirectory = getProjectRoot();
    const credentialsFilePath = path.join(rootDirectory, 'test_data', 'credentials.json');
    const data = require(credentialsFilePath);
    const envData = data['environment'][environment];
    console.log(`Environment information for ${environment} is: ${JSON.stringify(envData)}`);
    return envData;
}


export { getUserData, getCredentialsData }; 