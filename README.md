# E-Commerce app

Using nodejs to build a microservice demo

This project is using minikube for local kubernetes cluster

This project is base on this cource
[Microservices with Node JS and React](https://www.udemy.com/course/microservices-with-node-js-and-react/)

# before start

You need to build all docker images before start

`docker built -t eric/client-next ./client`

`docker built -t eric/auth ./auth`

`docker built -t eric/tickets ./tickets`

`docker built -t eric/orders ./orders`

`docker built -t eric/expiration ./expiration`

`docker built -t eric/payments ./payments`

# using ingress-nginx

start the ingress-nginx in your kubernetes
if using minikube

`minikube addons enable ingress`

# start

`skaffold dev`

# jwt secret key

Set your own secret key and using base64 to encode the secret key

rename the file jwt-secret.yaml.sample to jwt-secret.yaml

copy the encoded key to the file jwt-secret.yaml

`JWT_KEY: YOUR KEY HERE`

# stripe api key

Set your own secret key and using base64 to encode the secret key

rename the file stripe-secret.yaml.sample to stripe-secret.yaml

copy the encoded key to the file stripe-secret.yaml

`STRIPE_KEY: YOUR KEY HERE`
