const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// API Endpoint
const cohortName = "2302-ACC-PT-WEB-PT-A";

// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;
const PLAYERS_APIURL = `${APIURL}/players`;
const TEAM_APIURL = `${APIURL}/teams`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(APIURL + "players");
    const players = await response.json();
    const playersList = players.data.players;
    //console.log(playersList)
    return playersList;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
      const response = await fetch(`${PLAYERS_APIURL}/${playerId}`);
      const singlePlayerData = await response.json();
      const player = singlePlayerData.data.player;
      console.log(player);
      return player;
  } catch (err) {
      console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

const addNewPlayer = async (playerPayload) => {
  try {
      const response = await fetch(PLAYERS_APIURL,
          {
              method: 'POST',
              body: JSON.stringify(playerPayload),
              headers: {
                  'Content-Type': 'application/json',
              },
          });

      const responseData = await response.json();
      return responseData;
  } catch (err) {
      console.error('Oops, something went wrong with adding that player!', err);
  }
};

const removePlayer = async (playerId) => {
  try {
      const response = await fetch(`${PLAYERS_APIURL}/${playerId}`, {
          method: 'DELETE'
      });
      const deleteResponse = await response.json();
      return deleteResponse;
  } catch (err) {
      console.error(
          `Whoops, trouble removing player #${playerId} from the roster!`,
          err
      );
  }
};

export {
  fetchAllPlayers,
  fetchSinglePlayer,
  addNewPlayer,
  removePlayer,
};