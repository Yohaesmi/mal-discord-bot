import { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection, NoSubscriberBehavior } from '@discordjs/voice';
// import { createReadStream } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'url';
const __dirname = import.meta.dirname||fileURLToPath(import.meta.url);
const __filename = import.meta.filename;

const player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause,
	},
});

// const connection = joinVoiceChannel({
// 	channelId: channel.id,
// 	guildId: channel.guild.id,
// 	adapterCreator: channel.guild.voiceAdapterCreator,
// });
const connection = getVoiceConnection(myVoiceChannel.guild.id);

const resource = createAudioResource(join(__dirname, 'file.mp3'), { inlineVolume: true });
resource.volume.setVolume(0.5);

player.play(resource);