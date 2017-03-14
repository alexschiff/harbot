/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Slack bot built with Botkit.

This bot demonstrates many of the core features of Botkit:

* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
  for a user.

# RUN THE BOT:

  Get a Bot token from Slack:

    -> http://my.slack.com/services/new/bot

  Run your bot from the command line:

    token=<MY TOKEN> node slack_bot.js

# USE THE BOT:

  Find your bot inside Slack to send it a direct message.

  Say: "Hello"

  The bot will reply "Hello!"

  Say: "who are you?"

  The bot will tell you its name, where it is running, and for how long.

  Say: "Call me <nickname>"

  Tell the bot your nickname. Now you are friends.

  Say: "who am I?"

  The bot will tell you your nickname, if it knows one for you.

  Say: "shutdown"

  The bot will ask if you are sure, and then shut itself down.

  Make sure to invite your bot into other channels using /invite @<my bot>!

# EXTEND THE BOT:

  Botkit has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


if (!process.env.SLACK_TOKEN) {
    console.log('Error: Specify SLACK_TOKEN in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: false
});

var bot = controller.spawn({
    token: process.env.SLACK_TOKEN
}).startRTM();

var HarQuotes = [
        "Attack each day with an enthusiasm unknown to mankind.",
        "Realistic expectations for life are that we are going to be better today than we were yesterday, be better tomorrow than we were today.",
        "I don't take vacations. I don't get sick. I don't observe major holidays. I'm a jack hammer.",
        "I love being part of something that is working toward a greater goal, and there's no more satisfaction in life than achieving those goals as a team and being a part of that team.",
        "It can be a great temptation to rest on the field and let the opponent have a play without making him pay for every inch. I must hold his pain where it is. Mine does not matter. ... The punishment I inflict, his fatigue, and that he is up against something that he does not comprehend is everything.",
        "There are no turnarounds at Michigan. This is greatness. Long tradition of it.",
        "I was and still am happier than a pig in slop.",
        "That is a plan for success. So the key is simple: just work.",
        "Winning as a team is better than anything. It's great to share success.",
        "I have always believed that you win as part of a team effort. I've learned that if everybody does a little bit, it adds up to a lot.",
        "In the northern snowlands, down to the tropics' sunny scenes, he's catching the football. Where they throw a football, he'll be catching it.",
        "What will happen will happen, what won't happen won't happen.",
        "Fans have a constitutional right to expect success and have high expectations...",
        "I am now in control of all things.",
        "Anything is always a possibility. Wouldn't talk about what we would have done or what we would do. Everything is a possibility.",
        "I love people, I really do. I'm a people person. I think that's a strength of mine. I love being around people, especially in a team setting.",
        "People often think that there's a general who makes all the difference, but I would reject that. It's a team effort. It's the power of the wedge.",
        "I have never asked to be the highest-paid coach in football. I have never asked to be paid like a Super Bowl-winning coach. I have never asked for more power.",
        "You're kind of numb after 50 shots to the head.",
        "All human beings have a great agency for being part of a team.",
        "Hustle. Hustling at all times. Better today than yesterday, better tomorrow than today.",
        "I drank a lot of milk, Andrea. A lot of milk. Whole milk, though. Not the candy-ass two percent or skim milk.",
        "It's more than personal. I can't screw it up. I have to do good.",
        "I shook his hand too hard. I mean I really went in and it was strong and kind of a slap-grab-handshake. So, that was on me. Personally I can get better at the post-game handshake and we'll attempt to do that. I don't think there's any reason for an apology.",
        "Yeah, it's like coming out of the mother's womb. You're in a nice, warm, cozy environment, and you're reborn. And now you are out into the chaos, lights and everybody looking at you. And it’s wonderful.",
        "I’m not a food critic, merely a blunt instrument who only knows football.",
        "The football gods have provided us heat and sun to shape the body and carve the mind.",
        "Our guys were playing checkers and the little game with the triangle where you try to get it down to one golf tee. They had fun doing that. It was good. I got great pancakes and bacon. The best.",
        "I know we'll be best friends within a year's time.",
        "My default is 'yes' when asked to do things.",
        "Do not be deceived. You will reap what you sow.",
        "I own other pants.",
        "We have some great Supreme Court members, tremendous Supreme Court currently that we have, but I'd love to see Judge Judy on the Supreme Court. I just love everything about her.",
        "Question of the day: Does anyone find whining to be attractive? Just curious.",
        "Good to see Director Smith being relevant again after the tattoo fiasco. Welcome back!",
        "Have a Great day! A Great week! A Great month! and a Great year! and Go Blue!",
        "Well, you open it up - a brand new can of olives - and turn it over, and no olives come out.",
        "A birdwatcher knows the gist of a bird by just watching it.",
        "When you lie in Judge Judy's court room, it's over.",
        "Guilty as charged for fueling the hype...Well deserved.",
        "Honey badger don't care about no lights!",
        "If anybody knows how to reach them, I'd like to reunite my all-time favorite band Hootie and The Blowfish.",
        "I have a memory like an elephant...I never forget.",
        "It’s going to get real-real, and it’s going to get real-real, real fast for these young guys.",
        "I reduce a lot of drag by not having to choose what your going to wear everyday.",
        "So I anticipate the we’ll have some precipitation, some weather, and that will be a great thing for us.",
        "Trust is big to me. I'm a big fan of the Judge Judy show. When you lie in Judge Judy's courtroom, it's over. Your credibility is completely lost and you stand no chance of winning that case. I learned that from her. It's very powerful. And true. If somebody lies to you, how can you trust anything they say after that?",
        "A shout out from @JudgeJudy would make anyone's day, thank you! The BEST! & Excellence are easy to spot, Judge Judy is it's highest level.",
        "If worms had machine guns, then birds wouldn't be scared of them, you know?",
        "I've been trying to advise them to get two costumes, to be go-getters. Hit the neighborhood in one costume. Better to jog or run from house to house, then you can get more candy than anybody else. Then come home and make a quick change into a second costume and hit those same houses again.",
        "Zoo lions get tired of zebra after a while and want filet mignon. Not jungle lions.",
        "I take a vitamin every day; it's called a steak.",
        "That's kind of the way the pickle squirted this year.",
        "There’s a battle rhythm, a body clock that tells you it’s time for football. For me, it’s always I know when I get my first football dream. That’s my body clock telling me it’s time to compete.",
    ]

var JudyQuotes = [
           "A shout out from @JudgeJudy would make anyone's day, thank you! The BEST! & Excellence are easy to spot, Judge Judy is it's highest level.",
           "Big Congrats to Judge Judy on signing her contract extension thru 2020 from a Devout Fan!",
           "Trust is big to me. I'm a big fan of the Judge Judy show. When you lie in Judge Judy's courtroom, it's over. Your credibility is completely lost and you stand no chance of winning that case. I learned that from her. It's very powerful. And true. If somebody lies to you, how can you trust anything they say after that?",
           "When you lie in Judge Judy's court room, it's over.",
           "We have some great Supreme Court members, tremendous Supreme Court currently that we have, but I'd love to see Judge Judy on the Supreme Court. I just love everything about her.",
           ]

controller.hears([''], 'direct_message,direct_mention,mention', function(bot, message) {

    var chooseQuote  = HarQuotes[Math.random() * HarQuotes.length | 0]

    bot.reply(message, chooseQuote)

    });

controller.hears(['Harbaugh', 'Go Blue', 'Hail', 'Good morning', 'Michigan', 'khaki'], 'ambient', function(bot, message) {

    var chooseQuote  = HarQuotes[Math.random() * HarQuotes.length | 0]

    bot.reply(message, chooseQuote)

    });

controller.hears(['Judge Judy'], 'ambient', function(bot, message) {

    var chooseQuote  = JudyQuotes[Math.random() * JudyQuotes.length | 0]

    bot.reply(message, chooseQuote)

    });

controller.hears(['shutdown'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.ask('Are you sure you want me to shutdown?', [
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    }, 3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});


controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'],
    'direct_message,direct_mention,mention', function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':robot_face: I am a bot named <@' + bot.identity.name +
             '>. I have been running for ' + uptime + ' on ' + hostname + '.');

    });

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}
