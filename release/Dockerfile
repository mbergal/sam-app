FROM microsoft/dotnet:2.0-sdk
ARG COMMITSHA

RUN apt-get -y update
RUN apt-get -y install zip dos2unix mono-devel
RUN curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
RUN unzip awscli-bundle.zip
RUN ./awscli-bundle/install -b ~/bin/aws

ENV PATH="~/bin:${PATH}"

VOLUME /src
WORKDIR /src

CMD dos2unix ./release/run.sh && ./release/run.sh 
