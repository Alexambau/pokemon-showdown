import * as https from 'https';

const url = 'https://play.pokemonshowdown.com/customcss.php?server=eternity';

export const commands: Chat.ChatCommands = {
	reloadcss(target, room, user) {
		if (!user.can('lockdown')) return this.errorReply('You can\'t use this command.');
		
		let data: Uint8Array[] = [];
		https.get(url, res => {
			res.on('data', chunk => {
				data.push(chunk);
			});

			res.on('end', () => {
				this.sendReplyBox(Buffer.concat(data).toString());
				this.sendReply('CSS reloaded!');
			});
		}).on('error', () => {
			this.errorReply('An error ocurred trying to reload the css.')
		});
	},
	reloadcsshelp: [
		`/reloadcss - Makes a request to reload the css.`
	],
};