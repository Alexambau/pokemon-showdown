/************************************
 *	Fun Misc. Commands for PS!		*
 *	The following were coded by:	*
 *  Volco, Gyaratoast, and Insist	*
 ************************************/

 "use strict";

 import { FS } from '../../lib';
 
 let memes = FS("config/chat-plugins/memes.json").readIfExistsSync();
 
 if (memes !== "") {
	 memes = JSON.parse(memes);
 } else {
	 memes = {};
 }
 
 function write() {
	 FS("config/chat-plugins/memes.json").writeUpdate(() => (
		 JSON.stringify(memes)
	 ));
	 let data = "{\n";
	 for (let u in memes) {
		 data += '\t"' + u + '": ' + JSON.stringify(memes[u]) + ",\n";
	 }
	 data = data.substr(0, data.length - 2);
	 data += "\n}";
	 FS("config/chat-plugins/memes.json").writeUpdate(() => (
		 data
	 ));
 }
 
 exports.commands = {
	 "!hug": true,
	 hug: function (target, room, user) {
		 if (!target) return this.errorReply("/hug needs a target.");
		 if (!this.runBroadcast()) return;
		 this.sendReplyBox(`<center><img src="https://media.tenor.com/kCZjTqCKiggAAAAC/hug.gif" width="420" height="240"</center><br>${user.name} abraza a ${(target)}`);
	 },
	 "!slap": true,
	 slap: function (target, room, user) {
		 if (!target) return this.errorReply("/slap needs a target.");
		 if (!this.runBroadcast()) return;
		 this.sendReplyBox(`<center><img src="https://media.tenor.com/CvBTA0GyrogAAAAC/anime-slap.gif" width="420" height="240"</center><br>${user.name} abofetea salvajemente a ${(target)}`);
	 },
	 "!kiss": true,
	 kiss: function (target, room, user) {
		 if (!target) return this.errorReply("/kiss needs a target.");
		 if (!this.runBroadcast()) return;
	 
	 const img = ['https://i.gifer.com/origin/22/22d1db6014be2c75d2cbd1b69f43b94a.gif','https://i.gifer.com/origin/22/22d1db6014be2c75d2cbd1b69f43b94a.gif','https://media.tenor.com/06lz817csVgAAAAd/anime-anime-kiss.gif','https://media.tenor.com/jnndDmOm5wMAAAAC/kiss.gif','https://i.pinimg.com/originals/7e/af/82/7eaf82d33687f736437269c8bdb3a14d.gif'];
	 let chosen = Math.floor(Math.random() * img.length);
	 
		 this.sendReplyBox(`<center><img src="${img[chosen]}" width="420" height="240"</center><br>${user.name} besa salvajemente a ${(target)}`);
	 },
 
	 "!rko": true,
	 rko: function (target, room, user) {
		 if (!target) return this.errorReply("/rko needs a target.");
		 if (!this.runBroadcast()) return;
		 this.sendReplyBox(`<center><img src="https://media.tenor.com/qB-FXnVP_ZgAAAAC/rko-randy-orton.gif" width="420" height="240"</center><br>El asesino de leyendas ${user.name} ha noqueado de un RKO a ${(target)}`);
	 },
	 "!chanclazo": true,
	 chanclazo: function (target, room, user) {
		 if (!target) return this.errorReply("/rko needs a target.");
		 if (!this.runBroadcast()) return;
		 this.sendReplyBox(`<center><img src="https://media.giphy.com/media/TH2TwG8loO06Y/giphy.gif" width="240" height="420"</center><br>${user.name} le ha dado un headshot de chanclazo a ${(target)}`);
	 },
	 meme: "memes",
	 memes: {
		 add: function (target) {
			 if (!this.can("lock")) return;
			 let [name, img, height, width] = target.split(",").map(p => { return p.trim(); });
			 if (!width) return this.parse(`/memeshelp`);
			 if (name.length > 20) return this.errorReply(`Your name should be less than 20 characters long.`);
			 if (memes[toID(name)]) return this.errorReply(`${name} is already registered as a meme!`);
			 if (![".png", ".gif", ".jpg"].includes(img.slice(-4))) return this.errorReply(`The image needs to end in .png, .gif, or .jpg.`);
			 if (height > 500 || height < 100 || width > 500 || width < 100) return this.errorReply(`Your height and width attributes should be less than 500 and more than 100.`);
			 if (isNaN(height) || isNaN(width)) return this.errorReply(`Your height and width attributes must be a number!`);
			 memes[toID(name)] = {
				 name: name,
				 id: toID(name),
				 img: img,
				 height: height,
				 width: width,
			 };
			 write();
			 return this.sendReplyBox(`Meme ${name} created!<br /><img src="${img}" alt="${name}" title="${name}" height="${height}" width="${width}">.`);
		 },
 
		 delete: "remove",
		 clear: "remove",
		 remove: function (target) {
			 if (!this.can("lock")) return false;
			 if (!target) return this.errorReply("This command requires a target.");
			 let memeid = toID(target);
			 if (!memes[memeid]) return this.errorReply(`${target} is not currently registered as a meme.`);
			 delete memes[memeid];
			 write();
			 this.sendReply(`The meme "${target}" has been deleted.`);
		 },
 
		 list: function () {
			 if (!this.runBroadcast()) return;
			 if (Object.keys(memes).length < 1) return this.errorReply(`There are no memes on ${Config.serverName}.`);
			 let reply = `<strong><u>Memes (${Object.keys(memes).length.toLocaleString()})</u></strong><br />`;
			 for (let meme in memes) reply += `(<strong>${meme}</strong>) <button class="button" name="send" value="/meme show ${meme}">View ${meme}</button><br />`;
			 this.sendReplyBox(reply);
		 },
 
		 show: "display",
		 display: function (target, room, user) {
			 if (!this.runBroadcast()) return;
			 if (Object.keys(memes).length < 1) return this.errorReply(`There are no memes on ${Config.serverName}.`);
			 if (!target) {
				 let randMeme = Object.keys(memes)[Math.floor(Math.random() * Object.keys(memes).length)];
				 let title = memes[randMeme].name;
				 let randMemeImg = memes[randMeme].img;
				 let randMemeH = memes[randMeme].height;
				 let randMemeW = memes[randMeme].width;
				 this.sendReplyBox(`Random Meme "${title}": <img src="${randMemeImg}" alt="${title}" title="${title}" height="${randMemeH}" width="${randMemeW}">`);
			 } else {
				 let memeid = toID(target);
				 if (!memes[memeid]) return this.errorReply("That meme does not exist.");
				 let name = memes[memeid].name;
				 let img = memes[memeid].img;
				 let height = memes[memeid].height;
				 let width = memes[memeid].width;
				 this.sendReplyBox(`${name}:<br /> <img src="${img}" alt="${name}" title="${name}" height="${height}" width="${width}">`);
			 }
		 },
 
		 "": "help",
		 help: function () {
			 this.parse(`/memeshelp`);
		 },
	 },
 
	 memeshelp: [
		 `/memes add [name], [height], [width] - Adds a meme into the index. Requires Lock Access.
		 /memes delete [name] - Removes a meme from the index. Requires Lock Access.
		 /memes list - Shows all the memes in the index.
		 /memes show [optional meme name] - Shows the specified meme. If no target is specified, randomly displays a meme.
		 /memes help - Shows this command.`,
	 ],
 };