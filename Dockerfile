
FROM ubuntu:14.04

MAINTAINER Ziming Zhang "zzmbpt@163.com"

ENV REFRESHED_AT 2016-04-18

RUN sudo apt-get update


#install nginx

RUN sudo apt-get install -y nginx




WORKDIR /var
RUN sudo apt-get install -y git
RUN sudo apt-get install -y git-core

RUN git clone https://github.com/Sebastian1011/yubo.git

RUN cp -f /var/yubo/default /etc/nginx/sites-available/default



EXPOSE 80

CMD ["/bin/bash","nginx"]
