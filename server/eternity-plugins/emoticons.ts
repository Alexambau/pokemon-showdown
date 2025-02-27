import { FS } from '../../lib';

let emoticons: {[k: string]: string} = {':feelsbd:': 'http://i.imgur.com/TZvJ1lI.png'};
let emoticonsRegexp: RegExp = new RegExp(':feelsbd:', 'g');

export function hasEmotes(message: string): boolean {
	return !!message.match(emoticonsRegexp);
}

function loadEmoticons() {
	try {
		emoticons = JSON.parse(FS(`config/emoticons.json`).readIfExistsSync());
		let emotes: string[] = [];

		for (let emote in emoticons) {
			emotes.push(escapeRegExp(emote));
		}

		emoticonsRegexp = new RegExp(`(${emotes.join(`|`)})`, `g`);
	} catch (e) {}
}
void loadEmoticons();

function saveEmoticons() {
	FS(`config/emoticons.json`).writeSync(JSON.stringify(emoticons));
	let emotes = [];
	for (let emote in emoticons) {
		emotes.push(emote);
	}
	emoticonsRegexp = new RegExp(`(${emotes.join(`|`)})`, `g`);
}

function escapeRegExp(str: string) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); // eslint-disable-line no-useless-escape
}

export function parseEmoticons(message: string): string {
	if (emoticonsRegexp.test(message)) {
		const match = message.match(emoticonsRegexp)
		match?.forEach(emote => {
			message = message.replace(emote, `<img src="${emoticons[emote]}" width="50" height="50" />`);
		})

		return message;
	}

	return message;
}

function getEmoticonName(emote: string): string {
	if (emote.startsWith(':') && emote.endsWith(':')) return emote.slice(1, emote.length - 1);
	return emote;
}

export const commands: Chat.ChatCommands = {
	emoticons: 'emoticon',
	emote: 'emoticon',
	emotes: 'emoticon',
	emoticon: {
		add(target, room, user) {
			if (!user.can('gdeclare')) return;
			if (!target) return this.parse('/emoticonshelp');

			let targetSplit = target.split(',');
			for (let u in targetSplit) targetSplit[u] = targetSplit[u].trim();

			if (!targetSplit[1]) return this.parse('/emoticonshelp');
			if (targetSplit[0].length > 15) return this.errorReply('El nombre de un emoticono no puede superar los 15 caracteres..');
			if (targetSplit[0].length < 3) return this.errorReply('El nombre del emoticono debe superar los 3 caracteres.')
			if (emoticons[targetSplit[0]]) return this.errorReply(`${targetSplit[0]} ya es un emoticono.`);

			emoticons[targetSplit[0]] = targetSplit[1];
			saveEmoticons();

			this.sendReply("¡Emoticono guardado satisfactoriamente!");
			if (Rooms.search('Staff')) {
				const room = Rooms.search('Staff');
				room?.add(`${user.name} añadió el emoticono "${getEmoticonName(target[0])}" al servidor.`);
				room?.update();
			}
		},

		delete: 'del',
		remove: 'del',
		rem: 'del',
		del(target, room, user) {
			if (!user.can('gdeclare')) return;
			if (!target) return this.parse('/emoticonshelp');
			if (!emoticons[target]) return this.errorReply('El emoticono no existe..');

			delete emoticons[target];
			saveEmoticons();

			this.sendReply('El emoticono fue removido.');
			if (Rooms.search('Staff')) {
				const room = Rooms.search('Staff');
				room?.add(`${user.name} eliminó el emoticono "${getEmoticonName(target)}" del servidor.`);
				room?.update();
			}
		},

		view: 'list',
		list: function (target, room, user) {
			if (!this.runBroadcast()) return;
			let reply = `<strong><u>Emoticonos (${Object.keys(emoticons).length})</u></strong><br />`;
			for (let emote in emoticons) reply += `(${emote} <img src='${emoticons[emote]}' height='32' width='32'>)`;
			this.sendReplyBox(reply);
		},
	},
	emoticonshelp: [
		`Emoticon Commands:
		/emoticon add [name], [url] - Añade un nuevo emoticono. Requiere: @, &, #, ~
		/emoticon del/delete/remove/rem [name] - Remueve un emoticono. Requiere: @, &, #, ~
		/emoticon view/list - Despliega la lista de emoticonos.
		/emoticon help - Ayuda sobre comandos.`,
	],
};