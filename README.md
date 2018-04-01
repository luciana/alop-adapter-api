This is a NodeJS/ExpressJS Adapter REST API. It orchestrates multiple calls to backend business APIs and returns a single contract to a client. The application uses ReactiveX pattern with rx.js

The infrastructure architecture was build to run on AWS Elastic Container Service (ECS) as the container orchestrator, Amazon Elastic Container Registry (ECR) as the Docker Container Repository and Amazon Application Load Balancer to manage the various container instances.

The delivery pipepline uses AWS CodePipeline and AWS Code Build. The pipeline is trigger as the developer pushes to the master branch.


The application can be run locally with PM2 process manager or locally on Docker container or on the AWS cloud.


# Run it locally
$ npm install pm2 -g
$ npm start

# Test the API locally
$ curl -v -X GET "http://localhost:8081/api/v1/home" -H "Authorization: Bearer xxx" -H "Accept: application/json" -H "Content-type: application/json" 

-------------------------
# Run it locally on docker container ( assumes docker is installed)
docker build command builds an image from a Dockerfile and a context. 

$ docker build -t alop/alop-adapter-api .
	# -t flag tags the image so it's easier to find later using the docker images command:

$ docker images

$ docker run -p 3000:8081 -d alop/alop-adapter-api
	# -d runs the container in detached mode, leaving the container running in the background.
	# -p flag redirects a public port to a private port inside the container.
	# 3000->8081 Docker maps the 8081 port inside of the container to the port 3000 on localhost.
	# 8081 matches what it was EXPOSE in the dockerfile and app.js

# Get container ID
$ docker ps -a

# Print app output
$ docker logs <container id>


# Test the API on local Docker container
$ curl -v -X GET "http://localhost:3000/api/v1/home" -H "Authorization: Bearer xxx" -H "Accept: application/json" -H "Content-type: application/json" 

----------------------------------------


#Test the API on OpenShift

$ curl -v -X GET "http://test-alop-api.193b.starter-ca-central-1.openshiftapps.com/api/v1/home" -H "Authorization: Bearer ddd87fb9a543aa0c4d1dd58d55942606dbd5681bfec5311f4077d4b0610380a9" -H "Accept: application/json" -H "Content-type: application/json" 


