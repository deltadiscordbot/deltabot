module.exports = {
    name: 'wwdc',
    description: 'Countdown to WWDC 2020',
    category: "fun",
    async execute(message, args) {
        const countDownDate = new Date("Jun 22, 2020 12:00:00").getTime();
        const now = new Date().getTime();
        const distance = countDownDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if (days <= 0 && hours <= 1) {
            message.channel.send("Watch WWDC live here: https://youtu.be/GEZhD3J89ZE")
        } else {
            message.channel.send(`${days} day${Math.abs(days) === 1 ? "" : "s"}, ${hours} hour${Math.abs(hours) === 1 ? "" : "s"}, ${minutes} minute${Math.abs(minutes) === 1 ? "" : "s"}, and ${seconds} second${Math.abs(seconds) === 1 ? "" : "s"} until WWDC 2020!`)
        }
    },
};