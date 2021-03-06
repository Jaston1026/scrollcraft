const discord = require("discord.js")
const fs = require("fs")
const mongoose = require("mongoose")
const model = require("./models/model.js")
const discordButton = require("./libraries/button.js")
const button = require("./libraries/button.js")

module.exports = {
	key: "test",
    desc: "Testing commands and code in development 🛠",
    func: async (message, args, client, commands, config) => {
        if(config.table[0].WHITELIST.includes(message.author.username)){
            model.profile.find({uid: `acc_${message.author.id}`}, (err, docs) => {
                //Base atk * (1 + intel%) * (1 + strength%) * ceil(agility / 20)
                //Crits: DMGout + DMGout * CritDMG%
            })
        }
    }
}