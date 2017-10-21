FROM ubuntu:latest

RUN apt-get update -y

RUN apt-get install git -y
RUN apt-get install -y curl
RUN apt-get install -y wget

#install Nodejs
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y build-essential

#install MongoDB
RUN \
    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6 && \
    echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.4.list && \
    apt-get update && \
    apt-get install -y mongodb-org

#install bower
RUN npm install -g bower

RUN npm install -g forever

#donwload commonroutesServer
RUN git clone https://github.com/arnaucode/commonroutesServer.git
RUN cd commonroutesServer
RUN npm install

#run mongodb service
CMD service mongod start

CMD cd commonroutesServer && \
    forever start server.js

#commands to use:
#docker build -t containername .
#docker run -ti containername /bin/bash
#docker start -ti containername /bin/bash
#docker ps -a
#docker rm containernametodelete
#docker images
#docker rmi imagenametodelete
# delete all containers
#docker rm $(docker ps -a -q)
# delete all images
#docker rmi $(docker images -q)

