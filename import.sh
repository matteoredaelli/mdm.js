##filename=$1

step=$1
##cat $filename |
while read line ; do
   curl -XPOST -d "$line"  -H "Content-Type: application/json" http://localhost:3000/doc/import
done
#curl -XPOST http://localhost:3000/keys/save
