# mdm.js
yet an other Opensource Master Data Management system 

## setup

### Elastic search

docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch

   run the app:
     $ DEBUG=mdm.js:* npm start

curl -XPOST -d '{"A":"z"}' -H "Content-Type: application/json" http://localhost:3000/doc/normalize/before_import

