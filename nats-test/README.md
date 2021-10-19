# test the nats

port forward the nat-streaming 4222

1. find the nat pod
   `kubectl get pod`

2. port forward
   `kubectl port-forward REPLACE-THE-POD-NAME 4222:4222`
