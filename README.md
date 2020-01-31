# Disqus
Reddit clone, using only plane HTML, CSS and Javascript, i.e without any framework

### Installing Requirements
> npm install --save

### Usage 
> npm start 

and then go to http://localhost:4000

### To replicate backend part
requirements: docker-compose, docker, hasurs-cli: https://docs.hasura.io/1.0/graphql/manual/hasura-cli/install-hasura-cli.html

download the migrations folder from https://drive.google.com/drive/folders/19HuId1eu6puCDWkpmuRTtpmzF0jH7sMQ?usp=sharing

##### Run following commands
=> sudo docker-compose up -d

=> hasura migrate apply , ref: https://docs.hasura.io/1.0/graphql/manual/hasura-cli/hasura_migrate_apply.html

change the API_ENDPOINT in the .env file to : http://localhost:8080/v1/graphql

DB model

<img src="https://i.ibb.co/cwgmG1z/votercircle.png" alt="db-model" border="0"></a>


Note: .env file is included only for convenience




