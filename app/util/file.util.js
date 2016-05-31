import fs from "fs";
import path from "path";

export class FileUtil {
	static checkDir(dir) {
		if (!fs.existsSync(dir)) {
			var pathtmp;
			dir.split(path.sep).forEach(function(dirname) {
				if (pathtmp) {
					pathtmp = path.join(pathtmp, dirname);
				} else {
					pathtmp = dirname;
				}
				if (pathtmp == "")
					pathtmp = path.sep;
				if (!fs.existsSync(pathtmp)) {
					fs.mkdirSync(pathtmp);
				}
			});
		}
	}
}