/***************************
 Assassins' Guild Game tracker frontend
 To be used with TOM v2
 Made by bean_frog#6968
 If you use this somewhere credit me please thanks (and lmk)
***************************/
var response;
var nocache = Math.floor(Math.random() * 999999999999999999); //pseudo-random integer to prevent json from caching (and serving outdated info)

let statusDisplay = document.getElementById('status');
let gamemodeDisplay = document.getElementById('gamemode');
let modDisplay = document.getElementById('currentMod');
let playersDisplay = document.getElementById('players');

var xhr = new XMLHttpRequest();

xhr.open('GET', 'https://raw.githubusercontent.com/goofyahhstorageaccount/tom2-data/main/data.json?nocache=' + nocache, true);

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) { //xhr ready
    if (xhr.status === 200) { //file pulled
      //parse json from xhr and define keys
      var response = xhr.responseText;
      var data = JSON.parse(response);
      var gameValue = data.game;
      var gamemode = data.gamemode;
      var currentMod = data.mod;
      var playersAlive = data.playersalive;
      var playersDead = data.playersdead;
      var zombie = data.zombie;
      var zombierevealed = data.zombierevealed;
      var team1 = data.team1;
      var team2 = data.team2;
      var team3 = data.team3;
      if (gameValue === true) {
        //game true (all the main stuff below)
        statusDisplay.innerHTML = '<div class="badge badge-success gap-2">Game In progress</div>';
        //default game init stuff
        gamemodeDisplay.innerHTML = gamemode;
        modDisplay.innerHTML = currentMod;
        //killfeed
        var killfeedList = document.createElement('ul');
        var killfeedDiv = document.getElementById('killfeed');
        data.killfeed.forEach(function(entry) {
          var listItem = document.createElement('li');
          var names = entry.split('-');
          var entryText = names[0] + ' <i class="fa-regular fa-knife-kitchen fa-flip-horizontal"></i> ' + names[1];
          listItem.innerHTML = entryText;
          killfeedList.appendChild(listItem);
        });
        killfeedDiv.appendChild(killfeedList);
        //gamemodes
        if (gamemode === "Supercharged Frenzy") {
            
        } else if (gamemode === "Frenzy") {

        } else if (gamemode === "Zombies") {
            //show zombie as green if revealed
            if (zombierevealed) {
                var walker = document.createTreeWalker(
                  document.body,
                  NodeFilter.SHOW_TEXT,
                  null,
                  false
                );
                while (walker.nextNode()) {
                  var node = walker.currentNode;
                  var regex = new RegExp(zombie, "g");
                  if (node.textContent.includes(zombie)) {
                    var span = document.createElement("span");
                    span.style.color = "green";
                    span.innerHTML = node.textContent.replace(regex, "<span style='color:green'>$&</span>");
                    node.parentNode.replaceChild(span, node);
                  }
                }
              }
              else {
                return;
              }
              $('teams').hide();
        } else if (gamemode === "Teams") {

        } else if (gamemode === "Oxfords") {
            $('teams').hide();
        } else if (gamemode === "Last Man Standing") {
            $('teams').hide();
        } else if (gamemode === "Chaos") {
            $('teams').hide();
        } else if (gamemode === "Stealth") {
            $('teams').hide();
        } 




        //boring other stuff below
      } else {
        //No game Badge
        statusDisplay.innerHTML = '<div class="badge badge-error gap-2">No Current Game</div>';
        //clear all data
        playersDisplay.innerHTML = "";
        modDisplay.innerHTML = "";
        gamemodeDisplay.innerHTML = "";
      }
      //dont mess with anything below 
    } else if (xhr.status === 404) {
      console.log('Error 404 fetching json. Is the link correct?')
    }
  }
}
xhr.send();
