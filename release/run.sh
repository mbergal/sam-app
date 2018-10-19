cp -r /src /app
cd /app
dos2unix ./build.sh 
bash ./build.sh --commitSha=1234  --target=Release --verbosity=diagnostic