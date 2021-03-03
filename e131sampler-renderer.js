window.api.receive("log", (text) => {
    $("#log").prepend(text);
    $("#log").prepend("\n");
});
window.api.receive("progress", (current,duration) => {
    document.getElementById("progress").max = duration;
    document.getElementById("progress").value = current;
    var remaining = Math.round((duration-current)/1000);
    document.getElementById("progressText").innerHTML = "Sampling Lighting Data - " +remaining + " second" + (remaining == 1 ? '' :'s') + " remaining";
});
