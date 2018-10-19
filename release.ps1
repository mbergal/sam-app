docker build -f ./release/Dockerfile . -t mbergal/sam-app
docker run -v "${PSScriptRoot}:/src" mbergal/sam-app --env AWS_ACCESS_KEY=$AWS_ACCESS_KEY --env AWS_SECRET_KEY=$AWS_SECRET_KEY
