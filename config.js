var PLAYER_NAME = "You";

var PARTY_MAX_HIT_TITLE = "Party max hit";
var PLAYER_MAX_HIT_TITLE = "Your max hit";

// * Flags * //
// Set to true to hide NPCs. This is an experimental feature - use with caution.
var FLAG_HIDE_NPCS = false;

// Set to true to combine the Name and Job columns.
var FLAG_COMBINE_NAME_AND_JOB = false;

// Set to true to show party max hit and personal max hit
var FLAG_SHOW_MAX_HITS = true;


// set to 1 if you don't want to include LBs as a party max hit
var noLBInPartyMaxHit = 1;

// set to 1 if you don't want your own max hit in the party max hit.
// ie: the party max hit will show the max of your party members minus you
var noMyMaxHitInPartyMaxHit = 1;

// set to 1 to highlight the higher max hit between user and party
// only does something if both {maxHitCustom} and {myMaxHitCustom} are in encounterDefine
var colorHigherMaxHit = 1;


// Don't change this unless you know what you're doing.
// Setting this to true will use more computing power.
var DEBUG = false;
