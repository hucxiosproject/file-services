import {BaseService} from "./base.service";
export class VoiceService extends BaseService{

	constructor(mongo, voiceDir, log) {
		super(mongo, voiceDir, log, "voices");
		this._log.info("voice service instantiated");
	}
}