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

class MdmDB{
  constructor(settings) {
    this.index = settings.documents.document_type;
    this.obj = obj;	this.settings = settings;
  }

  save_doc(type, id, doc) {
    client.create({
      index: this.index,
      type: type,
      id: id,
      body: doc});
    }, function (error, response) {
      // ...
    });
  }

  get_doc(area, id) {
    this.client.search({
      index: this.index,
      type: area,
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


module.exports = MdmDb
