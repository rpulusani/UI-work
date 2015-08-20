#!/bin/bash

yum install -y docker
chkconfig docker --levels 2345 on
service docker start
