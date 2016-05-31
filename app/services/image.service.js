
import {BaseService} from "./base.service";
export class ImageService extends BaseService{

	constructor(mongo, imageDir, log) {
		super(mongo, imageDir, log, "images");
		this._log.info("image service instantiated");
	}
}