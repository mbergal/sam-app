FROM microsoft/dotnet:2.0-sdk

RUN apt-get -y update
RUN apt-get -y install zip dos2unix mono-devel
RUN curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
RUN unzip awscli-bundle.zip
RUN ./awscli-bundle/install -b ~/bin/aws

COPY ./src /app/src
COPY ./tools/packages.config /app/tools/packages.config
COPY ./build.cake /app
COPY ./test /app/test
COPY ./build.sh /app
COPY ./Solution.sln /app

RUN dos2unix /app/build.sh

WORKDIR /app
RUN  bash ./build.sh 
