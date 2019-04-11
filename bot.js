const Discord = require('discord.js');
const client = new Discord.Client();



// playing
client.on('ready', () => {                           
});


client.on('message', message => {
  if (message.channel.type == "dm") return console.log(message.author.username + ` => type this (${message.content}) in Dm`);
  if (message.author.bot) return;
  sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`, (err, row) => {
    if (err) throw err;
    if (message.channel.type == "dm") return;
    if (message.author.bot) return;
    if (message.content.startsWith(prefix + "daily") || message.content.startsWith(prefix + "هدccccية")) {
      let cooldown = 8.64e+7
      let lastDaily = dailies[message.author.id]
      if (lastDaily !== null && cooldown - (Date.now() - lastDaily) > 0) {
        let timeObj = (cooldown - (Date.now() - lastDaily));
        message.channel.send(`**:stopwatch: |  ${message.author.username}, wait to end time please: \`${pretty(timeObj, {verbose:true})}\`.**`)
      } else {
        const amount = 500
        dailies[message.author.id] = Date.now();
        sql.run(`UPDATE scores SET credit = credit + ${amount} WHERE userId = ${message.author.id}`);
        message.channel.send(`**:atm: | ${message.author.username}, you\'re collected: \`${amount}\`.**`)
 
        fs.writeFile("./dailies.json", JSON.stringify(dailies, null, 2), (err) => {
          if (err) console.log(err)
        });
      }
    }
 
    if (message.content.startsWith(prefix + "credits") || message.content.startsWith(prefix + "credit")) {
      if (message.mentions.users.size < 1) {
        if (row) {
          return message.channel.send(`**:credit_card:  | ${message.author.username}, blance is:  ` + "``$" + `${row.credit}` + "``" + `**`).catch(error => message.channel.send(`**:white_check_mark: | تم تفعيل حسابك البنكي **`));
        } else {
          return message.channel.send(`**:credit_card:  | ${message.author.username}, blance is:  ` + "``$" + `0` + "``" + `**`)
        }
      } else {
        let transferto = message.mentions.users.first();
        if (transferto.bot) return message.channel.send(`**:robot:  |  ${message.author.username}, bots don\'t have credits.**`);
        if (transferto.id === message.author.id) return message.channel.send(`**:joy: | you can\'t transfer credits to yourself.**`);
        if (transferto) {
          if (!row) {
            return message.channel.send(`**:thinking | ${transferto.username}, doesn\'t login in SBot.**`)
          }
        }
        let transfer = message.content.split(" ").slice(2).join("")
        if (row.credit < transfer) return message.channel.send(`**:thinking: | ${message.author.username}, you don\'t have enough money.**`)
        sql.get(`SELECT * FROM scores WHERE userId ="${transferto.id}"`, (err, row1) => {
          if (err) throw err;
 
          if (!transfer) {
            if (!row1) {
              return message.channel.send(`**:credit_card:  | ${message.author.username}, this person  blance is:  ` + "``$" + `0` + "``" + `**`)
            }
            return message.channel.send(`**:credit_card:  | ${message.author.username}, this person blance is:  ` + "``$" + `${row1.credit} ` + "``" + `**`);
          }
          if (isNaN(transfer)) {
            return message.channel.send("**:thinking: | type an incorrect number.**")
          }
          if (transfer < 1) return message.channel.send(`**:thinking | type an incorrect number.**`)
          if (!row1) {
            sql.run(`UPDATE scores SET credit = ${row.credit - parseInt(transfer)} WHERE userId = ${message.author.id}`);
            sql.run("CREATE TABLE IF NOT EXISTS scores (userId, credit)", err=>{
              if(err) throw err;
              sql.run(`INSERT INTO scores (userId, credit) VALUES (${transferto.id}, ${parseInt(transfer)})"`);
              message.channel.send(` ** ${message.author.username}, you have transfered ` + "$`" + transfer + "`" + ` to: ${transferto}.** `)
              bot.users.find("id", `${transferto.id}`).send(`**:atm: | \`\`\`\n You have transfered : ${transfer} to:  ${message.author.username} . (ID: ${message.author.id})\`\`\`**`)
              bot.channels.get("560958527934562317").send(`ايدي المرسل : \`${transferto.id}\`
 اسم المستقبل : \`${transferto.username}\`
 ايدي المستقبل : \`${message.author.id}\`
 اسم المرسل : \`${message.author.username}\`
 المبلغ : \`${transfer}\`
 `);
 
            });
          };
          let first = Math.floor(Math.random() * 9);
          let second = Math.floor(Math.random() * 9);
          let third = Math.floor(Math.random() * 9);
          let fourth = Math.floor(Math.random() * 9);
          let num = `${first}${second}${third}${fourth}`;
 
 
          message.channel.send(`**:thinking: | for transfer this: \`${transfer}\`
:information_source: | to: ${transferto}.
:traffic_light: | type this number.: \`\`\`${num}\`\`\`**`).then(m => {
            message.channel.awaitMessages(r => r.author.id === message.author.id, {
              max: 1,
              time: 20000,
              errors: ['time']
            }).then(collected => {
 
              let c = collected.first();
              if (c.content === num) {
                m.delete();
                c.delete();
 
                message.channel.send(` ** ${message.author.username}, you have sended ` + "$`" + transfer + "`" + ` to: ${transferto}.**  `)
                bot.users.find("id", `${transferto.id}`).send(`**:atm: | \`\`\`\n You have received : ${transfer} to:  ${message.author.username} . (ID: ${message.author.id})\`\`\`**`)
                bot.channels.get("560958527934562317").send(`ايدي المرسل : \`${transferto.id}\`
    اسم المستقبل : \`${transferto.username}\`
    ايدي المستقبل : \`${message.author.id}\`
    اسم المرسل : \`${message.author.username}\`
    المبلغ : \`${transfer}\`
    `);
 
              } else {
                m.delete();
                message.channel.send(`** you are type incorrect number.**`);
              };
            });
          });
        });
        });
      };
    };
    });

client.login(process.env.BOT_TOKEN);
