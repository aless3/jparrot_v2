@echo off

cd .\server
START CMD /C "npm start"

cd ..

cd .\client
START CMD /C "npm start"
