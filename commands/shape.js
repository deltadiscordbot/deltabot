const Discord = require('discord.js');
const { drawShape } = require('../Documents/shapemaker.js')
const Canvas = require('canvas');
module.exports = {
    name: 'shape',
    description: 'Used for internal testing. (Owner only)',
    needsowner: true,
    cooldown: 1,
    category: "owner",
    async execute(message, args) {
        let attachment;
        if (args[1] == "split") {
            let shapes = args[0].split(":")
            shapes = shapes.slice(1, shapes.length - 1)
            function spliter(cvs) {
                const width = (cvs[0].width * cvs.length);
                const height = cvs[0].height;
                const newCanvas = Canvas.createCanvas(width, height)
                ctx = newCanvas.getContext('2d');

                let canvases = [];
                let xCoord = 0;
                for (let index = 0; index < cvs.length; index++) {
                    canvases[index] = { cnv: cvs[index], x: xCoord };
                    xCoord += cvs[index].width;
                }
                canvases.forEach(function (n) {
                    ctx.beginPath();
                    ctx.drawImage(n.cnv, n.x, 0, width / cvs.length, height);
                });

                return newCanvas;
            }; for (let index = 0; index < shapes.length; index++) {
                shapes[index] = `:${shapes[index]}:`
            }
            let key = [];
            for (let index = 0; index < shapes.length; index++) {
                key[index] = shapes[index];
            }
            let cv = [];
            let ctx = [];
            for (let index = 0; index < key.length; index++) {
                cv[index] = Canvas.createCanvas(100, 100);
                ctx[index] = cv[index].getContext('2d')
                drawShape(key[index], cv[index], ctx[index], 100);
            }
            attachment = new Discord.MessageAttachment(spliter(cv).toBuffer(), `shape-${key}.png`);
        } else {
            let m = args[0].match(/:?([a-zA-Z\-]*:)([a-zA-Z\-]*:?)*:?/)
            if (!m) return;
            let key = m[0];
            cv = Canvas.createCanvas(100, 100)
            ctx = cv.getContext('2d')
            drawShape(key, cv, ctx, 100);
            attachment = new Discord.MessageAttachment(cv.toBuffer(), `shape-${key}.png`);
        }
        message.channel.send(attachment);

    },
};