import wrap from "co-monk";
import cofs from "co-fs";
import fs from "fs";
import fsextra from "co-fs-extra";
import path from "path";
import mongodb from "mongodb";
var ObjectID = mongodb.ObjectID;

import {FileUtil} from "../util/file.util";

export class BaseService {

	constructor(mongo, dir, log, tableName) {
		this._mongo = mongo;
		this._dir = dir;
		this._log = log;

		this._table = wrap(mongo.get(tableName));
	}

	* upload(files, fields, app) {
		// check dir exist
		var fileDir = path.join(this._dir, app);
		FileUtil.checkDir(fileDir);

		var fileList = [];
		for (var key in files) {
			var file = files[key];
			if (file.size == 0)
				continue;

			if (file instanceof Array) {
				console.log("we get same picture");
				// get same pictures
				for (var i = 0; i < file.length ; i ++) {
					var samefile = file[i];
					if (samefile.size == 0)
						continue;
					
					var filename = String(ObjectID());
					var newfilepath = path.join(fileDir, filename);
					yield fsextra.move(samefile.path, newfilepath);
					var data = {
						type: samefile.type,
						name: filename,
						size: samefile.size,
						app: app
					};
					var doc = yield this._table.insert(data);
					var result = {
						id: doc._id,
						name: samefile.name
					};
					fileList.push(result);
				}
			} else {
				var dirs = file.path.split(path.sep);
				var filename = String(ObjectID());
				var newfilepath = path.join(fileDir, filename);
				yield fsextra.move(file.path, newfilepath);
				var data = {
					type: file.type,
					name: filename,
					size: file.size,
					app: app
				};
				var doc = yield this._table.insert(data);
				var result = {
					id: doc._id,
					name: file.name
				};
				fileList.push(result);
			}
		}
		return fileList;
	}

	* get(id, app) {
		var data = yield this._table.findOne({_id: ObjectID(String(id))});
		var fileDir = path.join(this._dir, app);
		return {
			mimeType: data.type,
			body: fs.createReadStream(path.join(fileDir, String(data.name)))
		};
	}
}