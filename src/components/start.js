const discord = require("discord.js")
const mongoose = require("mongoose")
const model = require("./models/model.js")

const classes_file = "./src/components/assets/classes.json"

const template = {
	table: []
}

var classes = {}

// Functions to get declared, write here
const refreshJSONBuffer = (filepath, obj) => {
	try {
		const data = fs.readFileSync(filepath)
		const temp = JSON.parse(data)
		const keys = Object.keys(temp)

		keys.some((value) => {
			obj[value] = temp[value]
		})
	} catch {
		console.log(`Can't read ${filepath}`)
		console.log(`Writing template to ${filepath}`)
		fs.writeFileSync(filepath, JSON.stringify(template, null, 2))
		refreshJSONBuffer(filepath, obj)
	}

	Object.freeze(obj)
}

module.exports = {
	key: "start",
	desc: "Creates player profile for the game",
	func: async (message, args, client, commands) => {
		model.profile.find({uid: `acc-${message.author.id}`}, (err, docs) => {
			if(err == null) {
				refreshJSONBuffer(classes_file, classes)

				let proceed = false
				let payload
				let pages	
				let initialIndex = 0
			
				const pageLimit = 1
				const payloadBuffer = []

				const readFirstEmbed = new discord.MessageEmbed()

				const generateEmbed = (page) => {
					const payloadEmbed = new discord.MessageEmbed()
		
					pages = payloadBuffer.length
		
					payloadBuffer[page - 1].forEach((value, index) => {
						payloadEmbed.addField(`${value[0]} ${value[1].icon}` , value[1].desc)
					})
		
					payloadEmbed
						.setAuthor(message.author.tag, message.author.displayAvatarURL({ format: "png", dynamic: true }))
						.setTitle("Character Creation")
						.setColor("#0074FF")
						.setFooter(`Page ${page} of ${pages}`)
		
					return payloadEmbed
				}

				//main code starts
				readFirstEmbed
					.setAuthor(message.author.tag, message.author.displayAvatarURL({ format: "png", dynamic: true }))
					.setTitle("Character Creation")
					.setColor("#0074FF")
					.addField("React to start character creation", "Each class only gives you a differences in initial starting stats & ability to master a weapon class, meaning you can be a warlock but uses a sword, but with limitations.")
					.setFooter("Everyone only have one choice at character creation, choose wisely")
					.setTimestamp()

				message.channel.send(readFirstEmbed).then((list) => {
					list.react("✅").then(list.react("❌"))
			
					const filter = (reaction, user) => {
						return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id
					}
	
					const collector = list.createReactionCollector(filter, {
						time: 60000
					})
	
					collector.on("collect", (reaction) => {
						list.reactions.removeAll().then(async() => {
							if(reaction.emoji.name === '✅') {
								proceed = true
								list.reactions.removeAll().then(async() => {
									list.delete()
								})

								payload = Object.entries(classes).map(value => {
									return value
								})
						
								payload.forEach((value, index) => {
									index += 1
									if((index % pageLimit) === 0) {
										payloadBuffer.push(payload.slice(initialIndex, index))
										initialIndex += pageLimit
									} else if(index === payload.length) {
										payloadBuffer.push(payload.slice(initialIndex, index))
									}
								})

								console.log(payloadBuffer)
						
								message.channel.send(generateEmbed(1)).then((list) => {
									let currentPage = 1
						
									if(pages > 1) {
										list.react("➡️")
						
										const filter = (reaction, user) => {
											return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id
										}
						
										const collector = list.createReactionCollector(filter, {
											time: 60000
										})
						
										collector.on("collect", (reaction) => {
											list.reactions.removeAll().then(async() => {
												if(reaction.emoji.name === '➡️') {
													currentPage += 1
												} else if(reaction.emoji.name === '⬅️') {
													currentPage -= 1
												}
						
												list.edit(generateEmbed(currentPage))
						
												if(currentPage > 1) {
													await list.react('⬅️')
												}
						
												if(currentPage < pages) {
													list.react('➡️')
												}
											})
										})
						
										collector.on("end", collected => {
											message.channel.send("No Class Selected")
											list.reactions.removeAll().then(async() => {
												list.delete()
											})
										})
									}
								})
							} else if(reaction.emoji.name === '❌') {
								message.channel.send("Exited Character Creation")
								list.reactions.removeAll().then(async() => {
									list.delete()
								})
							}
						})
					})
				})
			} else {
				message.channel.send(`**${message.author} already have a profile on the database**`)
			}
		})
	}
}