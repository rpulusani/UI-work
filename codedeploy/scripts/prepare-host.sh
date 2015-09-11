#!/bin/bash

yum install -y docker
chkconfig docker --levels 2345 on
service docker start

# Retreive encrypted blob from S3 and decrypt via AWS KMS
if [[ ! -f /root/.docker/config.json ]]; then
    mkdir /root/.docker
    aws s3 cp s3://lexmark-mps-portal2-config/common/dockercfg /tmp/dockercfg.encrypted
    aws kms decrypt --query Plaintext --output text --region us-east-1 --ciphertext-blob fileb:///tmp/dockercfg.encrypted | base64 -d > /root/.docker/config.json
fi

