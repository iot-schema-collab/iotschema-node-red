FROM ubuntu
RUN apt-get update && apt-get -y upgrade && apt-get install sudo
RUN sudo apt-get install -y git curl && curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
RUN sudo apt-get install -y nodejs
RUN sudo apt install -y maven
ENV JAVA_HOME /usr/lib/jvm/java-11-openjdk-amd64
RUN export JAVA_HOME
RUN sudo npm install -g --unsafe-perm node-red
COPY nodered.sh nodered.sh
RUN chmod +x ./nodered.sh
RUN ./nodered.sh
RUN cd root/.node-red && npm i coap && npm i request
RUN cd root/.node-red && npm i @iotschema/iotschema-capability && npm i @iotschema/iotschema-utilitynodes
COPY start.sh start.sh
RUN chmod +x ./start.sh
CMD sh start.sh
EXPOSE 8080/tcp
EXPOSE 1880/tcp