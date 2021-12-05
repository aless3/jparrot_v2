@echo off

cd .\server
START CMD /C "npx nodemon router.js"

cd ..

cd .\client
START CMD /C "npm start"
