# CodeMon App

Welcome to the CodeMon App. This application provides user an interactive and responsive user interface to test their programming skills and track their progress.

## Git Repo: 
- https://github.com/amberiitd/codemon.git

## Video Demo: 
- https://vimeo.com/903344490?share=copy


## Features

- User Authentication: Secure your data with user authentication to ensure that your data is private and accessible only to authorized users.

- Programming tests: One can take as many coding tests as they want.

- Interactive code editor

- Past test records: Past test results are saved for users and can be accessed from the dashboard.

- Resposive UI: user can code using their Mobile as well as computers.

- Themed UI: User can toggle app theme ("light" or "dark") as per the preference.

## How to Get Started
- Clone the git repository using `git clone https://github.com/amberiitd/codemon.git`

- Change you directory and move to the client application directory: `cd codemon/frontend`

- Install dependencies `npm install`

- Run your application locally using `npm start`

- Go to `https://localhost:3000` using your browser.

- User Registration: Begin by registering as a user to access the full functionality of the Codemon App.


## Security
We prioritize the security of your data. User authentication ensures that only authorized individuals have access to application features, providing a safe and reliable environment for your personal needs.

## Technologies used:

- Amazon Web Services (AWS)

  1. Cognito Pool: To manage user base, assign user role.
  2. Cognito Identity Provider: To issue IAM credential to access the service.
  3. DynamoDB: As database to save test results
  4. AWS Lambda: to auto confirm cognito user and host api on a serverless framework which is cost effective.
  5. API Gateway: To expose the endpoint for the apis, also used as an authentication layer and integrated with AWS lambda.
  6. Cloudwatch Logs: For logging and monitoring 

- ReactJs: For frontend design.

- JBoot Apis: Jboot apis are used for test evaluation and the implementation can be found in `codemon/backend`.

## Components
1. `backend`: This is a `npm` project as well as `serverless` project. `serverless.yml` includes configuration for deployment of lamda serverless apis.

4. `frontend`: A sample UI project which demonstrates the api in use.

## NOTE

- You can choose to run the frontend application without worrying about deploying the backend servers and other resources. You can use the resources mentioned in the `codemon/frontend/.env` for the purpose of getting started. 