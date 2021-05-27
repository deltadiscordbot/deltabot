const Discord = require('discord.js');
const deltaDiscordID = "625714187078860810", altstoreDiscordID = "625766896230334465";
const cooldowns = new Discord.Collection();

module.exports = async (client, member) => {
        if (member.guild.id == deltaDiscordID) {
            let deltaMember, role;
            async () => {
                try {
                    deltaMember = await deltaDiscord.members.cache.get(member.user.id);
                } catch (error) {
                    console.log(error)
                }
                altMemberRole = await deltaDiscord.roles.cache.find(role => role.id === '847259095010377740');                                                                                                                                                                                                                                      //grabs the "AltMember" role object
            }
            if (deltaMember != undefined) {
                if (!deltaMember.roles.cache.some(role => role.id === '847259095010377740')) {                                                                                                                                                                                                                                                      //checks if a user DOESN'T have the "AltMember" role
                    if (deltaMember.roles.cache.some(role => role.id === '724745592747589672') || deltaMember.roles.cache.some(role => role.id === '847304060544745492') || deltaMember.roles.cache.some(role => role.id === '719312337470750810')) {                                                                                               //-checks if a user has an "iOS" role                     
                        if (deltaMember.roles.cache.some(role => role.id === '719369094297812993') || deltaMember.roles.cache.some(role => role.id === '847474574412218409')) {                                                                                                                                                                     //-checks if a user has a "Jailbreak" role                     
                            if (deltaMember.roles.cache.some(role => role.id === '847512231302004778') || deltaMember.roles.cache.some(role => role.id === '847507222934061087') || deltaMember.roles.cache.some(role => role.id === '847507324842147860')) {                                                                                       //-checks if a user has an "Experience" role                     
                               if (deltaMember.roles.cache.some(role => role.id === '847303756176424971') || deltaMember.roles.cache.some(role => role.id === '719312337064165396') || deltaMember.roles.cache.some(role => role.id === '847472981130084382') || deltaMember.roles.cache.some(role => role.id === '719312336447471667')) {          //-checks if a user has a "AltServer Platform" role                     
                                   if (deltaMember.roles.cache.some(role => role.id === '847310971269414933') || deltaMember.roles.cache.some(role => role.id === '847311073156661258')) {                                                                                                                                                          //-checks if a user has a "Device" role                     
                                       if (deltaMember.roles.cache.some(role => role.id === '847506847752519720') || deltaMember.roles.cache.some(role => role.id === '847517763966205974')) {                                                                                                                                                      //-checks if a user has a "Collaborator" role                     
                                            member.roles.add(altMemberRole);                                                                                                                                                                                                                                                                        //assigns the "AltMember" role object
                                        };  
                                    };  
                                };  
                            };  
                        };    
                    };                    
                };
            }
        } else if (member.guild.id == altstoreDiscordID) {
            let altMember, role;
            async () => {
                try {
                    altMember = await altstoreDiscord.members.cache.get(member.user.id);
                } catch (error) {
                    console.log(error)
                }
                userMainRole = await deltaDiscord.roles.cache.find(role => role.id === '847259095010377740')
            }
            if (altMember != undefined) {

            }
        }
};
