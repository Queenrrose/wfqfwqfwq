const fs = require('node:fs');
const path = require('node:path');
const numeral = require('numeral');
const { Client, GatewayIntentBits, Partials, ActivityType, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers, 
  ],
  partials: [Partials.Channel, Partials.GuildMember],
});

client.db = db;
client.config = require('./config/config.js');

const localesPath = path.join(__dirname, 'locales');
const localeFiles = fs.readdirSync(localesPath).filter(file => file.endsWith('.json'));

client.locale = new Map();
for (const file of localeFiles) {
  const filePath = path.join(localesPath, file);
  const localeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const localeName = path.basename(file, '.json');
  client.locale.set(localeName, localeData);
}

console.log('✅ Loaded localization files.');

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  try {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.execute) {
      client.on(event.name, (...args) => event.execute(client, ...args));
    }
    console.log(`✅ Loaded event: ${event.name}`);
  } catch (error) {
    console.error(`❌ Error loading event ${file}:`, error);
  }
}

client.once('ready', () => {
  console.clear();
  const line = '─'.repeat(50);
  console.log(line);
  console.log(`🌐 ${client.user.tag} is now online!`);
  console.log(line);
  console.log(`🤖 Bot Username  : ${client.user.username}`);
  console.log(`🆔 Bot ID        : ${client.user.id}`);
  console.log(`📅 Launched On   : ${new Date().toLocaleString()}`);
  console.log(line);
  console.log(`📊 Connected to  : ${client.guilds.cache.size} servers`);
  console.log(`👥 Total Users   : ${client.users.cache.size}`);
  console.log(`📁 Loaded Events : ${eventFiles.length}`);
  console.log(line);
  console.log(`© 2024 wickstudio - All Rights Reserved.`);
  console.log(`🔗 GitHub: Queen`);
  console.log(`🌐 YouTube: Queen`);
  console.log(`💬 Discord: Queen`);
  console.log(line);
  console.log('✅ Bot is fully operational and ready to serve!');
  console.log(line);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
  console.error('Uncaught exception:', error);
});

client.login(client.config.discordToken);

client.on('error', console.error);
client.on('warn', console.warn);


// Array of status messages
const statusMessages = [
  "إذَا سَلَّمَ عَلَيْكُمْ أَهْلُ الْكِتَابِ فَقُولُوا: وَعَلَيْكُمْ.",
      "يَا حَيُّ يَا قيُّومُ بِرَحْمَتِكَ أسْتَغِيثُ أصْلِحْ لِي شَأنِي كُلَّهُ وَلاَ تَكِلْنِي إلَى نَفْسِي طَـرْفَةَ عَيْنٍ.",
      "((اللَّهُمَّ اغْفِرْ لَهُ، اللَّهُمَّ ثَبِّتْهُ)).",
      "إِنَّ للَّهِ مَا أَخَذَ، وَلَهُ مَا أَعْطَى، وَكُلُّ شَيْءٍ عِنْدَهُ بِأَجَلٍ مُسَمَّى... فَلْتصبرْ وَلْتَحْتَسِبْ. وَإِنْ قَالَ: أَعْظَمَ اللَّهُ أَجْرَكَ، وَأَحْسَنَ عَزَاءَكَ، وَغَفَرَ لِمَيتِك فَحَسَنٌ.",
      "أَسْأَلُ اللَّهَ الْعَظيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفيَكَ",
      "قَالَ جَابرُ بْنُ عَبْدِ اللَّهِ رَضِيَ اللَّهُ عَنْهُمَاآنِ، يَقُولُ: إِذَا هَمَّ أَحَدُكُمْ بِالْأَمْرِ فَلْيَرْكَعْ رَكْعَتَيْنِ مِنْ غَيْرِ الْفَرِيضَةِ، ثم لْيَقُلْ: اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بعلْمكَ، .",
      "مَنْ أَطْعَمَهُ اللَّهُ الطَّعَامَ فَلْيَقُلْ: اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَأَطْعِمْنَا خَيْراً مِنْهُ، وَمَنْ سَقَاهُ اللَّهُ لَبَناً فَلْيَقُلْ اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ.",
      "((مِلْءَ السَّمَوَاتِ وَمِلْءَ الأَرْضِ، وَمَا بَيْنَهُمَا، وَمِلْءَ مَا شِئْتَ مِنْ شَيءٍ بَعْدُ. أَهلَ الثَّناءِ وَالْمَجْدِ، أَحَقُّ مَا قَالَ الْعَبْدُ، وَكُلُّنَا لَكَ عَبْدٌ. اللَّهُمَّ لاَ مانِعَ لِمَا أَعْطَيْتَ، وَلاَ مُعْطِيَ لِمَا مَنَعْتَ، وَلاَ يَنْفَعُ ذَا الجَدِّ مِنْكَ الجَدُّ)).",
      "إذَا سَلَّمَ عَلَيْكُمْ أَهْلُ الْكِتَابِ فَقُولُوا: وَعَلَيْكُمْ.",
      "يَا حَيُّ يَا قيُّومُ بِرَحْمَتِكَ أسْتَغِيثُ أصْلِحْ لِي شَأنِي كُلَّهُ وَلاَ تَكِلْنِي إلَى نَفْسِي طَـرْفَةَ عَيْنٍ.",
      "((اللَّهُمَّ اغْفِرْ لَهُ، اللَّهُمَّ ثَبِّتْهُ)).",
      "إِنَّ للَّهِ مَا أَخَذَ، وَلَهُ مَا أَعْطَى، وَكُلُّ شَيْءٍ عِنْدَهُ بِأَجَلٍ مُسَمَّى... فَلْتصبرْ وَلْتَحْتَسِبْ. وَإِنْ قَالَ: أَعْظَمَ اللَّهُ أَجْرَكَ، وَأَحْسَنَ عَزَاءَكَ، وَغَفَرَ لِمَيتِك فَحَسَنٌ.",
      "أَسْأَلُ اللَّهَ الْعَظيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفيَكَ",
      "قَالَ جَابرُ بْنُ عَبْدِ اللَّهِ رَضِيَ اللَّهُ عَنْهُمَاآنِ، يَقُولُ: إِذَا هَمَّ أَحَدُكُمْ بِالْأَمْرِ فَلْيَرْكَعْ رَكْعَتَيْنِ مِنْ غَيْرِ الْفَرِيضَةِ، ثم لْيَقُلْ: اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بعلْمكَ، .",
      "مَنْ أَطْعَمَهُ اللَّهُ الطَّعَامَ فَلْيَقُلْ: اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَأَطْعِمْنَا خَيْراً مِنْهُ، وَمَنْ سَقَاهُ اللَّهُ لَبَناً فَلْيَقُلْ اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ.",
      "((مِلْءَ السَّمَوَاتِ وَمِلْءَ الأَرْضِ، وَمَا بَيْنَهُمَا، وَمِلْءَ مَا شِئْتَ مِنْ شَيءٍ بَعْدُ. أَهلَ الثَّناءِ وَالْمَجْدِ، أَحَقُّ مَا قَالَ الْعَبْدُ، وَكُلُّنَا لَكَ عَبْدٌ. اللَّهُمَّ لاَ مانِعَ لِمَا أَعْطَيْتَ، وَلاَ مُعْطِيَ لِمَا مَنَعْتَ، وَلاَ يَنْفَعُ ذَا الجَدِّ مِنْكَ الجَدُّ)).",
  // Add more status messages as needed
];

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  setStatus(); // Initial status setup
  setInterval(setStatus, 3000000); // Update status every 30 seconds
});


//
const channelID = '1326574678046937159'; // ID of the voice channel you want the bot to join

let reconnectTimeout = null; // Variable to hold the timeout for reconnection

client.once('ready', async () => {

    const channel = client.channels.cache.get(channelID);
    if (!channel || channel.type !== 'GUILD_VOICE') {
        return console.error('The channel does not exist or is not a voice channel.');
    }

    try {
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
        console.log('</> Bot connected to the voice channel successfully!');
    } catch (error) {
        console.error(error);
    }
});

client.on('voiceStateUpdate', (oldState, newState) => {
    // Check if the bot left the voice channel
    if (oldState.member && oldState.member.user.bot && oldState.channelId && !newState.channelId) {
        const channel = client.channels.cache.get(channelID);
        if (channel && channel.type === 'GUILD_VOICE') {
            try {
                // Clear previous timeout if exists
                if (reconnectTimeout) {
                    clearTimeout(reconnectTimeout);
                    reconnectTimeout = null;
                }

                reconnectTimeout = setTimeout(() => {
                    const connection = joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator,
                    });

                    console.log('Bot reconnected to the voice channel.');
                }, 5000); // Reconnect after 5 seconds
            } catch (error) {
                console.error(error);
            }
        }
    }
});
// Function to set streaming status with dynamic text
const setStatus = () => {
  const randomIndex = Math.floor(Math.random() * statusMessages.length);
  const statusText = statusMessages[randomIndex];

  client.user.setActivity(statusText, {
    type: ActivityType.Custom,
    status: 'idle',
    url: 'https://twitch.tv/YourChannel' // Replace with your Twitch channel URL
  });
};


const USER_IDS_TO_MONITOR = [
  "",  // استبدل بمعرفات المستخدمين الفعليين
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // أضف المزيد من معرفات المستخدمين كما تحتاج
];

// التعامل مع الرسائل
client.on('messageCreate', async (message) => {
  // التحقق إذا كان كاتب الرسالة ضمن قائمة المراقبين
  if (USER_IDS_TO_MONITOR.includes(message.author.id)) {
    const newMessage = {
      content: message.content || '\u200B',
      embeds: message.embeds.map((embed) => new MessageEmbed(embed)),
      files: message.attachments.map((attachment) => attachment),
    };

    try {
      // حذف الرسالة الأصلية وإرسال الرسالة الجديدة في القناة
      await Promise.all([message.delete(), message.channel.send(newMessage)]);

      // إرسال رسالة خاصة إلى البوت في حالة أن المرسل ضمن القائمة
      const botUser = await client.users.fetch(client.user.id); // الحصول على حساب البوت
      if (botUser) {
        // إرسال رسالة خاصة للبوت
        await botUser.send(`تمت مراقبة رسالة من ${message.author.tag} في القناة ${message.channel.name}: \n${newMessage.content}`);
      }
    } catch (err) {
      console.error(`Error while deleting or resending message:`, err);
    }
  }

  // التحقق من رسائل البوت نفسه
  if (message.author.id === client.user.id) {
    if (message.content.includes("type these numbers to confirm")) {
      setTimeout(() => {
        message.delete().catch((err) => console.error('Error while deleting message:', err));
      }, 10000); // حذف الرسالة بعد 10 ثواني
    } else if (message.content.includes("Cool down")) {
      setTimeout(() => {
        message.delete().catch((err) => console.error('Error while deleting message:', err));
      }, 2000); // حذف الرسالة بعد 2 ثانية
    }
  }
});


// Define multiple server and channel configurations
const serverConfigs = [
  {
    sourceServerId: '1256512584975126528',
    sourceChannelId: '1259773421160759326',
    targetServerId: '1305099898643025920',
    targetChannelId: '1328369562240028722',
    targetRoleToMentionId: '',
    //imageURL: 'https://imgur.com/VnUq9Go', // games
    //linkURL: 'https://example.com/link2',
    //additionalMessage: 'Additional message for server 2.',
    mentionEveryone: false // Add this line to control whether @everyone should be mentioned false    true
  },
      {
    sourceServerId: '1256512584975126528',
    sourceChannelId: '1259773421160759326',
    targetServerId: '1283875563488149617',
    targetChannelId: '1328369768046137456',
    targetRoleToMentionId: '',
    //imageURL: 'https://imgur.com/VnUq9Go',  // games 
    //linkURL: 'https://example.com/link2',
    //additionalMessage: 'Additional message for server 2.',
    mentionEveryone: false // Add this line to control whether @everyone should be mentioned false    true
  },
      {
    sourceServerId: '1256512584975126528',
    sourceChannelId: '1256513069849509929',
    targetServerId: '1305099898643025920',
    targetChannelId: '1328369524331778081',
    targetRoleToMentionId: '',
    //imageURL: 'https://imgur.com/VnUq9Go',// azkar
    //linkURL: 'https://example.com/link2',
    //additionalMessage: 'Additional message for server 2.',
    mentionEveryone: false // Add this line to control whether @everyone should be mentioned false    true
  },
      {
    sourceServerId: '1256512584975126528',
    sourceChannelId: '1256513093584945205',
    targetServerId: '1305099898643025920',
    targetChannelId: '1328369524331778081',
    targetRoleToMentionId: '',
    //imageURL: 'https://imgur.com/VnUq9Go', // azkar
    //linkURL: 'https://example.com/link2',
    //additionalMessage: 'Additional message for server 2.',
    mentionEveryone: false // Add this line to control whether @everyone should be mentioned false    true
  },
      {
    sourceServerId: '1256512584975126528',
    sourceChannelId: '1256513069849509929',
    targetServerId: '1283875563488149617',
    targetChannelId: '1328369731123544137',
    targetRoleToMentionId: '',
    //imageURL: 'https://imgur.com/VnUq9Go', // azkar
    //linkURL: 'https://example.com/link2',
    //additionalMessage: 'Additional message for server 2.',
    mentionEveryone: false // Add this line to control whether @everyone should be mentioned false    true
  },
      {
    sourceServerId: '1256512584975126528',
    sourceChannelId: '1256513093584945205',
    targetServerId: '1283875563488149617',
    targetChannelId: '1328369731123544137',
    targetRoleToMentionId: '',
    //imageURL: 'https://imgur.com/VnUq9Go', // azkar
    //linkURL: 'https://example.com/link2',
    //additionalMessage: 'Additional message for server 2.',
    mentionEveryone: false // Add this line to control whether @everyone should be mentioned false    true
  },
      {
    sourceServerId: '1256512584975126528',
    sourceChannelId: '1305105706826993727',
    targetServerId: '1305099898643025920',
    targetChannelId: '',
    targetRoleToMentionId: '',
    //imageURL: 'https://imgur.com/VnUq9Go',  // vidoe
    //linkURL: 'https://example.com/link2',
    //additionalMessage: 'Additional message for server 2.',
    mentionEveryone: false // Add this line to control whether @everyone should be mentioned false    true
  },

  // Add more configurations as needed
];

client.once('ready', () => {
  console.log('Bot is ready!');
});

client.on('messageCreate', async (message) => {
  try {
    // Check if the message is from any of the specified source servers and channels
    for (const config of serverConfigs) {
      if (message.guild.id === config.sourceServerId && message.channel.id === config.sourceChannelId) {
        // Fetch the target guild
        const targetGuild = await client.guilds.fetch(config.targetServerId);

        // Fetch the target channel in the target guild
        const targetChannel = await targetGuild.channels.fetch(config.targetChannelId);

        let messageContent = '';

        // Check for @here mention in the message content
        if (message.content.includes('@here')) {
          messageContent += '@here ';
        }

        // Add @everyone mention if configured
        if (config.mentionEveryone) {
          messageContent += '@everyone ';
        }

        // Optionally mention a role in the target channel
        const targetRole = targetGuild.roles.cache.get(config.targetRoleToMentionId);
        if (targetRole) {
          messageContent += `<@&${config.targetRoleToMentionId}> `;
        } else {
          console.error(`Target role with ID ${config.targetRoleToMentionId} not found in target server.`);
        }

        // Add the original message content
        messageContent += message.content;

        // Add image URL if present
        if (config.imageURL) {
          messageContent += `\nImage URL: ${config.imageURL}`;
        }

        // Add link URL if present
        if (config.linkURL) {
          messageContent += `\nLink URL: ${config.linkURL}`;
        }

        // Add additional message if present
        if (config.additionalMessage) {
          messageContent += `\n${config.additionalMessage}`;
        }

        // Prepare the message options to send
        const messageOptions = {
          content: messageContent,
          files: message.attachments.map(attachment => attachment.url),
          embeds: message.embeds
        };

        // Send the message to the target channel in the target server
        await targetChannel.send(messageOptions);
        
        // Log the forwarding action
        console.log(`Forwarded message from ${message.author.tag} in ${message.guild.name} (${message.guild.id}) to ${targetGuild.name} (${targetGuild.id}) / ${targetChannel.name}`);
      }
    }
  } catch (error) {
    console.error('Error forwarding message:', error);
  }
});


// Array of status messages
// Existing roleIDs array and functions for adding/removing role IDs
const roleIDs = [
  '',
  '',
  '',
  '',
  '',
  // Add more role IDs as needed
];

let intervalTime = 120 * 1000; // الوقت الافتراضي بين كل تغيير

client.once('ready', () => {
  console.log('Bot is ready.');
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith('/') || message.author.bot) return;

  const args = message.content.slice('/'.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'addrole') {
    const roleID = args[0];
    if (!roleID) return message.reply('Please provide a role ID to add.');

    if (!roleIDs.includes(roleID)) {
      roleIDs.push(roleID);
      message.reply(`Role with ID ${roleID} has been added.`);
    } else {
      message.reply('Role ID is already in the list.');
    }
  } else if (command === 'removerole') {
    const roleID = args[0];
    if (!roleID) return message.reply('Please provide a role ID to remove.');

    const index = roleIDs.indexOf(roleID);
    if (index !== -1) {
      roleIDs.splice(index, 1);
      message.reply(`Role with ID ${roleID} has been removed.`);
    } else {
      message.reply('Role ID not found in the list.');
    }
  } else if (command === 'setinterval') {
    const newInterval = parseInt(args[0]);
    if (!newInterval || newInterval <= 0) return message.reply('Please provide a valid interval (in seconds).');

    intervalTime = newInterval * 1000;
    message.reply(`Interval time set to ${newInterval} seconds.`);
  }
});

// Interval task to change role colors
const changeRoleColorsTask = setInterval(async () => {
  const guildID = '1305099898643025920';
  const guild = client.guilds.cache.get(guildID);

  if (!guild) {
    console.error(`Guild with ID ${guildID} not found.`);
    return;
  }

  roleIDs.forEach(async (roleID) => {
    const role = guild.roles.cache.get(roleID);
    if (!role) {
      console.error(`Role with ID ${roleID} not found in guild ${guild.name}.`);
      return;
    }

    try {
      await role.setColor(Math.floor(Math.random() * 16777215));
      console.log(`Changed color of role ${role.name} in guild ${guild.name}.`);
    } catch (error) {
      console.error(`Error changing color of role ${role.name}:`, error);
    }
  });
}, intervalTime);



client.on("messageCreate", async message => {
  if (message.author.bot) return;

  // تطبيع النص ليصبح كله بحروف صغيرة
  const content = message.content.toLowerCase();
  let args = message.content.split(" ").slice(1).join(" ");

  // دالة لتحويل الأحرف مثل "K" و "M" إلى أرقام
  const parseNumber = (input) => {
      input = input.toLowerCase().trim(); // التأكد من الحروف الصغيرة
      if (input.endsWith("k")) {
          return parseFloat(input.slice(0, -1)) * 1000; // "K" -> ألف
      } else if (input.endsWith("m")) {
          return parseFloat(input.slice(0, -1)) * 1000000; // "M" -> مليون
      }
      return parseFloat(input); // إذا لم يكن هناك "K" أو "M"
  };

  // أمر: وسيط / #wa
  if (content.startsWith('we') || content.startsWith('وسيط') || content.startsWith('$wa') || 
      content.startsWith('!wa') || content.startsWith('.wa') || content.startsWith('-wa')) {

      let args2 = args;
      var number = parseNumber(args2); // استخدام الدالة لتحليل الرقم
      if (isNaN(number) || number <= 0) return;

      let tax = Math.floor(number * (20) / (19) + 1);
      let tax2 = Math.floor(tax - number);
      let tax3 = Math.floor(number * (20) / (19) + 1);
      let tax4 = Math.floor(tax2 + tax3 + number);
      let tax021 = Math.floor(tax * (20) / (19) + 1);

      let errorembed3 = new EmbedBuilder()
          .setDescription(`
  ${message.author} **وسيط [رقم]
  #wa [number]** :x:`) // الإيموجي :x: كرمز للخطأ
          .setColor("#FF00FF");

      if (!args2 || number > 1000000000) {
          const errorMessage = await message.channel.send({ embeds: [errorembed3] });
          setTimeout(() => errorMessage.delete().catch(() => {}), 1000);
          return message.delete().catch(() => {});
      }

      let embed = new EmbedBuilder()
          .setColor("#FF00FF")
          .setThumbnail(message.guild.iconURL())
          .setTitle(`**ضريبه الوسيط** : **${tax2}**
                      **ضريبة التحويل** : **${tax3}**
                      **المبلغ المطلوب تحويله** : **${tax021}**`)
          .setDescription(`🔹 ${message.author}, تم حساب الضرائب الخاصة بك.`);

      const responseMessage = await message.channel.send({ embeds: [embed] });
      setTimeout(() => responseMessage.delete().catch(() => {}), 20000);
      message.delete().catch(() => {});
  }

  // أمر: ضريبة / #tax
  if (content.startsWith('dd') || content.startsWith('ضريبة') || content.startsWith('d') || 
      content.startsWith('-tax') || content.startsWith('!tax') || content.startsWith('.tax') || 
      content.startsWith('tax') || content.startsWith('ضريبه')) {

      let args2 = args.replace(/<@!?(\d+)>/, '').trim();
      var number = parseNumber(args2); // استخدام الدالة لتحليل الرقم
      if (isNaN(number) || number <= 0) return;

      let tax1 = Math.floor(number * (20) / (19) + (1));
      let tax5 = Math.floor(number - number * 5 / 100);
      let tax6 = Math.floor(number * 5 / 100);

      let errorembed3 = new EmbedBuilder()
          .setColor("#FF00FF")
          .setDescription(`
  :x: ${message.author} **ضريبة [رقم]
  #tax [number]**`);

      if (!args2 || number > 1000000000) {
          const errorMessage = await message.channel.send({ embeds: [errorembed3] });
          setTimeout(() => errorMessage.delete().catch(() => {}), 1000);
          return message.delete().catch(() => {});
      }

      const exampleEmbed5 = new EmbedBuilder()
          .setColor('#FF00FF')
          .setTitle(`كم لازم تحول عشان يوصل المبلغ بالكامل : ${tax1}
  كم بتوصل لـ الشخص: ${tax5}
  ضريبه اللي بتنسحب : ${tax6}`)
          .setDescription(`✅ ${message.author}, تمت عملية الحساب بنجاح!`);

      const responseMessage = await message.channel.send({ embeds: [exampleEmbed5] });
      setTimeout(() => responseMessage.delete().catch(() => {}), 20000);
      message.delete().catch(() => {});
  }
});
