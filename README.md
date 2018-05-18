# mdm.js

 __  __   ____    __  __         _       
|  \/  | |  _ \  |  \/  |       (_)  ___ 
| |\/| | | | | | | |\/| |       | | / __|
| |  | | | |_| | | |  | |  _    | | \__ \
|_|  |_| |____/  |_|  |_| (_)  _/ | |___/
                              |__/       

yet an other Opensource Master Data Management system 

## setup

   cp custom_module.js.sample custom_module.js

   run the app:
     $ DEBUG=mdm.js:* npm start


curl -XPOST http://localhost:3000/db/step/import/append
curl -XPOST http://localhost:3000/db/step/append/merge
curl -XPOST http://localhost:3000/db/step/merge/export
curl -XGET  http://localhost:3000/db/export/csv/export > export.csv
curl -XGET  http://localhost:3000/db/export/kv/audit > audit.csv

