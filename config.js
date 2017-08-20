const PLAYER_NAME = "Sara Neko";

const PARTY_MAX_HIT_TITLE = "Master Hit";
const PLAYER_MAX_HIT_TITLE = "Kitt Hit";

// set to 1 if you don't want to include LBs as a party max hit
var noLBInPartyMaxHit = 1;

// set to 1 if you don't want your own max hit in the party max hit.
// ie: the party max hit will show the max of your party members minus you
var noMyMaxHitInPartyMaxHit = 1;

// set to 1 to highlight the higher max hit between user and party
// only does something if both {maxHitCustom} and {myMaxHitCustom} are in encounterDefine
var colorHigherMaxHit = 1;

// エンカウント情報の定義
var encounterDefine = "";
encounterDefine += "Time: <span class='enc'>{duration}</span> &nbsp; ";
encounterDefine += "Party DPS: <span class='enc'>{ENCDPS}</span> <br>";
encounterDefine += PARTY_MAX_HIT_TITLE + ": <span class='enc'>{maxHitCustom}</span><br>";
encounterDefine += PLAYER_MAX_HIT_TITLE + ": <span class='enc'>{myMaxHitCustom}</span>";

// 上記のエンカウント情報を HTML として扱うなら true
var useHTMLEncounterDefine = true;