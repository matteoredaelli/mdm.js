/*
#    Copyright (C) 2017 till now -  Matteo.Redaelli@gmail.com>
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

"use strict";

var elasticsearch = require('elasticsearch');

class DB{
  constructor(db) {
    this.client = new elasticsearch.Client({
      host: db.host,
      log: db.log
    });
    this.index = db.index;

    this.ping();
    this.create_index(this.index);
  }

  ping(timeout = 3000) {
    this.client.ping({
      requestTimeout: timeout,
    }, function (error) {
      if (error) {
        console.error('elasticsearch cluster is down!');
      } else {
        console.log('elasticsearch cluster is up');
      }
    });
  }

  create_index(index) {
    this.client.indices.create({
      index: this.index,
      ignore: true
    }).then(function (body) {
      // since we told the client to ignore 404 errors, the
      // promise is resolved even if the index does not exist
      console.log('index was (eventually) created');
    } , function (error) {
    // oh no!
      console.error('index was (eventually) created');
    });
  }

  delete_index(index) {
    this.client.indices.delete({
      index: this.index,
      ignore: [404]
    }).then(function (body) {
      // since we told the client to ignore 404 errors, the
      // promise is resolved even if the index does not exist
      console.log('index was deleted or never existed');
    } , function (error) {
    // oh no!
    });
  }

  save_doc(doc_type, id, doc) {
    console.log('index=' + this.index + ', type=' + doc_type + ', id=' + id + ', doc=' + doc);

    return this.client.index({
      index: this.index,
      type: doc_type,
      id: id,
      body: doc})
    }

  get_doc(doc_type, id) {
    this.client.search({
      index: this.index,
      type: doc_type,
      body: {
        query: {
          match: {
            _id: id
          }
        }
      }
    }).then(function (resp) {
      return resp.hits.hits;
    }, function (err) {
      console.trace(err.message);
    });
  }
}


module.exports = DB
