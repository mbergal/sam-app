docker build -f ./release/Dockerfile . -t mbergal/sam-app
docker run -v "${PSScriptRoot}:/src" mbergal/sam-app
