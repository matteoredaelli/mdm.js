# mdm.js

 __  __   ____    __  __         _       
|  \/  | |  _ \  |  \/  |       (_)  ___ 
| |\/| | | | | | | |\/| |       | | / __|
| |  | | | |_| | | |  | |  _    | | \__ \
|_|  |_| |____/  |_|  |_| (_)  _/ | |___/
                              |__/       

yet an other Opensource Master Data Management system 

## setup

   run the app:
     $ DEBUG=mdm.js:* npm start


curl -XPOST http://localhost:3000/db/step/import/append
curl -XPOST http://localhost:3000/db/step/append/merge
curl -XPOST http://localhost:3000/db/step/append/merge
curl -XPOST http://localhost:3000/db/step/merge/export
curl -XGET  http://localhost:3000/db/export/export > export.csv

