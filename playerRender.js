// Import all API fetch
import {
  fetchAllPlayers,
  fetchSinglePlayer,
  addNewPlayer,
  removePlayer,
} from "./playerCrud.js";

// Get to DOM element
const playerContainer = document.getElementById("players-container");
const playerDetail = document.getElementById("player-detail-container");
const newPlayerFormContainer = document.getElementById("new-player-form");
const title = document.querySelector("#title");
const btnNewPlayer = document.querySelector("#newPlayerBtn");

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 *
 * Then it takes that larger string of HTML and adds it to the DOM.
 *
 * It also adds event listeners to the buttons in each player card.
 *
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 *
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 *
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 *
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (players) => {
  try {
    playerContainer.innerHTML = "";
    players.forEach((puppy) => {
      const puppyCard = document.createElement("div");
      const puppyContainer = document.createElement("div");
      const puppyColumn = document.createElement("div");

      puppyCard.classList.add("card");
      puppyContainer.classList.add("container");
      puppyColumn.classList.add("column");

      puppyCard.innerHTML = `
                <img class = "img-card" src="${puppy.imageUrl}" alt="Avatar" style="width:100%">
                `;

      puppyContainer.innerHTML = `
                <h1>${puppy.name}</h1>
                <div class="btn-container">
                  <button class="details-button btn btn-primary btn-round-2" data-id="${puppy.id}">Details</button>
                  <button class="delete-button btn btn-danger btn-round-2" data-id="${puppy.id}">Delete</button>
                </div>
            `;

      puppyCard.appendChild(puppyContainer);
      puppyColumn.appendChild(puppyCard);
      playerContainer.appendChild(puppyColumn);

      // see details
      const detailsButton = puppyCard.querySelector(".details-button");
      detailsButton.addEventListener("click", async (event) => {
        const id = event.target.dataset.id;
        playerContainer.style.display = "none";
        playerDetail.style.display = "block";
        const player = await fetchSinglePlayer(id);
        renderPlayerDetail(player);
      });

      // delete puppy
      const deleteButton = puppyCard.querySelector(".delete-button");
      deleteButton.addEventListener("click", async (event) => {
        const id = event.target.dataset.id;
        await removePlayer(id);
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
      });
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderPlayerDetail = (puppy) => {
  try {
    const puppyCard = document.createElement("div");
    const puppyContainer = document.createElement("div");
    const puppyColumn = document.createElement("div");

    puppyCard.classList.add("card-puppy-details");
    puppyContainer.classList.add("container");

    puppyCard.innerHTML = `
              <img class = "img-card" src="${puppy.imageUrl}" alt="Avatar" style="width:100%">
              `;

    puppyContainer.innerHTML = `
              <h1>${puppy.name}</h1>
              <h2>${puppy.status}</h2>
              <div class="btn-container">
                <button class="btn btn-primary btn-round-2 close-button">Close</button>
              </div>
          `;
    title.innerHTML = "Puppy Detail";
    puppyCard.appendChild(puppyContainer);
    puppyColumn.appendChild(puppyCard);
    playerDetail.appendChild(puppyColumn);

    const closeButton = puppyCard.querySelector(".close-button");
    closeButton.addEventListener("click", async () => {
      playerDetail.style.display = "none";
      playerContainer.style.display = "block";
      puppyCard.remove();
      title.innerHTML = "Puppy Roster";
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

const renderNewPlayerForm = async () => {
  try {
    let formHTML = `
    <form class="form-style-9">
      <ul>
        <li>
          <input type="text" id="name" class="field-style field-full align-none" placeholder="Name" />
        </li>
        <li>
          <input type="text" id="breed" class="field-style field-full align-none" placeholder="Breed" />
        </li>
        <li>
          <label for="status"> Status: </label>
          <select id="status" name="status">
            <option value="field">Field</option>
            <option value="bench">Bench</option>
          </select>
        </li>
        <li>
          <input type="text" id="url" class="field-style field-full align-none" placeholder="url" />
        </li>
        <li>
          <label for="team"> Team: </label>
          <select id="team" name="team">
            <option value="375">Ruff</option>
            <option value="376">Fluff</option>
          </select>
        </li>
        <li>
          <input class="details-button btn btn-primary btn-round-2" type="submit" id="create-button" value="Create" />
          <input class="delete-button btn btn-danger btn-round-2" type="submit" id="cancel-button" value="Cancel" />
        </li>
      </ul>
    </form>
    `;
    title.innerHTML = "Add a new Player";
    newPlayerFormContainer.innerHTML = formHTML;
    // cancel button
    const cancelButton = newPlayerFormContainer.querySelector("#cancel-button");
    const createButton = newPlayerFormContainer.querySelector("#create-button");

    cancelButton.addEventListener("click", async (e) => {
      newPlayerFormContainer.style.display = "none";
    });

    createButton.addEventListener("click", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const breed = document.getElementById("breed").value;
      const status = document.getElementById("status").value;
      const url = document.getElementById("url").value;
      const team = document.getElementById("team").value;

      const newPlayer = {
        name,
        breed,
        status,
        url,
        team,
      };

      if (!name || !breed || !status || !url || !team) {
        alert("Please fill all information.");
        return
      } else if (!/^https?:\/\/(?:[a-z]+\.)?[a-z0-9-]+\.[a-z]{2,}(?:\/[^/]+)*\/[^/]+\.(?:jpe?g|png)$/i.test(url)) {
          alert("Please enter a valid URL. Only JPEG and PNG files are accepted.");
          return
      };

      await addNewPlayer(newPlayer);
      const players = await fetchAllPlayers();
      renderAllPlayers(players);
      playerContainer.style.display = "block";
      btnNewPlayer.style.display = "blobk";
      newPlayerFormContainer.style.display = "none";
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

btnNewPlayer.addEventListener("click", async (e) => {
  e.preventDefault();
  playerContainer.style.display = "none";
  renderNewPlayerForm();
  btnNewPlayer.style.display = "none";
  newPlayerFormContainer.style.display = "block";
});

const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  // renderNewPlayerForm();
};

init();
