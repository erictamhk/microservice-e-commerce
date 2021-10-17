# E-Commerce app

Using nodejs to build a microservice demo

This project is using minikube for local kubernetes cluster

This project is base on this cource
[Microservices with Node JS and React](https://www.udemy.com/course/microservices-with-node-js-and-react/)

# before start

You need to build all docker images before start

`docker built -t eric/client-next ./client`

`docker built -t eric/auth ./auth`

# start

`skaffold dev`

# jwt secret key

Set your own secret key and using base64 to encode the secret key

rename the file jwt-secret.yaml.sample to jwt-secret.yaml

copy the encoded key to the file jwt-secret.yaml

`JWT_KEY: YOUR KEY HERE`
