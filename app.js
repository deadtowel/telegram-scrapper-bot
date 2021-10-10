const scrapper = require('./scrapper-lib/scrapper');
const TelegramApi = require('node-telegram-bot-api');

const TELEGRAM_TOKEN = '2072421892:AAEetvxOCWvottRxjpKbaJKmluxr5DneRro';

(async function main() {
	const bot = new TelegramApi(TELEGRAM_TOKEN, { polling: true });

	bot.setMyCommands([
		{ command: '/start', description: 'Старт бота' },
		{ command: '/settings', description: 'Настройки' },
		{ command: '/get_current_rate', description: 'Получить текущий курс' },
	]);

	//replying markup default
	const default_markup = JSON.stringify({
		inline_keyboard: [
			[
				{
					text: 'Получить текущий курс 💰',
					callback_data: 'currentRate',
				},
			],
			[{ text: 'Настройки ⚙️', callback_data: 'settings' }],
		],
	});

	//Commands
	bot.onText(/\/start/, (msg) => {
		startMessage = bot.sendMessage(
			msg.chat.id,
			'Добро пожаловать в Казахстан!	🇰🇿 🇰🇿 🇰🇿',
			{
				reply_markup: default_markup,
			},
		);
	});

	bot.onText(/\/settings/, async (msg) => {
		const chatId = msg.chat.id;
		await bot.sendMessage(chatId, 'Тут должны быть настройки, но');
		await bot.sendSticker(
			chatId,
			'https://tlgrm.ru/_/stickers/dc7/a36/dc7a3659-1457-4506-9294-0d28f529bb0a/16.webp',
		);
	});

	bot.onText(/\/get_current_rate/, async (msg) => {
		const chatId = msg.chat.id;

		await bot.sendMessage(chatId, 'Ждемс...');

		let text;
		await getStringifyCurrentRate().then((result) => {
			text = result;
		});
		await bot.sendMessage(chatId, text);
	});

	// Click listener
	bot.on('callback_query', async (msg) => {
		const chatId = msg.message.chat.id;

		//remove markup after click
		bot.editMessageReplyMarkup(null, {
			chat_id: chatId,
			message_id: msg.message.message_id,
		});

		switch (msg.data) {
			case 'settings':
				await bot.sendMessage(chatId, 'Тут должны быть настройки, но');
				await bot.sendSticker(
					chatId,
					'https://tlgrm.ru/_/stickers/dc7/a36/dc7a3659-1457-4506-9294-0d28f529bb0a/16.webp',
					{
						reply_markup: default_markup,
					},
				);
				break;
			case 'currentRate':
				const sentMessage = await bot.sendMessage(chatId, 'Парсим данные...');

				let text;
				await getStringifyCurrentRate().then((result) => {
					text = result;
				});
				await bot.editMessageText(text, {
					chat_id: chatId,
					message_id: sentMessage.message_id,
					reply_markup: default_markup,
				});
				break;
			default:
				await bot.sendMessage(chatId, 'Произошёл непонятный пиздец!');
				break;
		}
	});
})();

async function getStringifyCurrentRate() {
	const fiatRate = await scrapper.getCurrentFiatRate();
	const p2pRate = await scrapper.getCurrentP2pRate('AnyCashBot');
	return scrapper.output(fiatRate, p2pRate.rate);
}
