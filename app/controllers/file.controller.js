import coformidable from "koa-formidable";
import formidable from "formidable";
import util from "util";

export function FileController(service, type) {
	return {
		* upload(next) {
			// var opts = {
			// 	multiples: true,
			// 	keepExtensions: true,
			// 	maxFieldsSize: 20 * 1024 * 1024 // 10 * 1024 * 1024
			// };
			var opts = new formidable.IncomingForm();
			opts.maxFieldsSize = 20 * 1024 * 1024;
			opts.multiples = true;
			opts.keepExtensions = true;

			var form = yield coformidable.parse(opts, this);
			var app = this.params.app;

			this.type = "json";
      this.status = 200;
      this.body = yield service.upload(form.files, form.fields, app);
      // this.body = util.inspect(form.files);
		},

		* get(next) {
			var app = this.params.app;
			var id = this.params.id;

			var img = yield service.get(id, app);
			this.set('Cache-Control', 'max-age=604800');
      this.type = img.mimeType;
      this.status = 200;
      this.body = img.body;
		}
	};
}