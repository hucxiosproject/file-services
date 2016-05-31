require('newrelic');

import koa from "koa";
var app = koa();

import bodyParser from "koa-bodyparser";
app.use(bodyParser());

var imageDir = "/data/images";
var voiceDir = "/data/voices";

app.use(function *(next) {
  try {
    yield next;
  } catch (err) {
    this.status = err.status || 500;
    this.body = err.message;
    this.app.emit('error', err, this);
  }
});

import bunyan from "bunyan";
var log = bunyan.createLogger({name: "file-services"});
app.on('error', function(err){
  log.error(err);
});

import monk from "monk";
import wrap from "co-monk";
import mongodb from "mongodb";
var ObjectID = mongodb.ObjectID;
var db = monk(process.env.MONGO_URL);

import {ImageService} from "./services/image.service";
var imageService = new ImageService(db, imageDir, log);
import {VoiceService} from "./services/voice.service";
var voiceService = new VoiceService(db, voiceDir, log);

import {FileController} from "./controllers/file.controller";
var imageController = FileController(imageService);
var voiceController = FileController(voiceService);


import router from "koa-router";
var r = new router();
r.post("/image/:app", imageController.upload);
r.get("/image/:app/:id", imageController.get);
r.post("/voice/:app", voiceController.upload);
r.get("/voice/:app/:id", voiceController.get);
app.use(r.middleware());

import cors from "koa-cors";
app.use(cors());

app.listen(5000);
log.info("app listen 5000");