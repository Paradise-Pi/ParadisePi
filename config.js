//Lighting - sACN (aka E131)
const LXConfig = {
    "e131Universes":2, //Always starts at universe 1, but how many universes to output?
    "e131SourceName":"Paradise Pi",
    "e131Priority":25, //Higher priority takes precedence. 25 is default as it'll normally be in the background
    "e131Frequency":"5" //In HZ - this is only a target and it might not represent real-world conditions
}
module.exports = { LXConfig };