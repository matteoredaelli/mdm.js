# mdm.js

 __  __   ____    __  __         _       
|  \/  | |  _ \  |  \/  |       (_)  ___
| |\/| | | | | | | |\/| |       | | / __|
| |  | | | |_| | | |  | |  _    | | \__ \
|_|  |_| |____/  |_|  |_| (_)  _/ | |___/
                              |__/       

yet an other Opensource Master Data Management system

## setup

   create a file config_sample.yaml like config_tyre.yaml

   create a file custom_module_sample.js like custom_module_tyre.js

   run the app:
     $ DEBUG=mdm.js:* project=sample npm start


curl -XPOST http://localhost:3000/db/step/import/append
curl -XPOST http://localhost:3000/db/step/append/merge
curl -XPOST http://localhost:3000/db/step/merge/export
curl -XGET  http://localhost:3000/db/export/csv/export > export.csv
curl -XGET  http://localhost:3000/db/export/kv/audit > audit.csv


rockdb:
real	2m34.005s
user	1m25.582s
sys	0m47.456s

