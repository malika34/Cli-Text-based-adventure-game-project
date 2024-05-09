#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";

// Define types for game choices
type Choice = {
    description: string;
    action: () => void;
};

// Define player state
type PlayerState = {
    health: number;
    inventory: string[];
};

// Initialize player state
let player: PlayerState = {
    health: 5, // Starting health points
    inventory: []
};

// Define game scenarios
const scenarios: { [key: string]: Choice[] } = {
    start: [
        {
            description: "You wake up in a dark room. What do you do?",
            action: () => {
                console.log(chalk.yellow("You're in a dark room."));
                chooseScenario(scenarios.room);
            }
        }
    ],
    room: [
        {
            description: "You see a door. Do you open it?",
            action: () => {
                console.log(
                    chalk.green("You open the door and find yourself in a corridor.")
                );
                chooseScenario(scenarios.corridor);
            }
        },
        {
            description: "You sit down and wait.",
            action: () => {
                console.log(
                    chalk.red("Nothing happens. You're still in the dark room.")
                );
                chooseScenario(scenarios.room);
            }
        }
    ],
    corridor: [
        {
            description: "You see a staircase going up. Do you take it?",
            action: () => {
                console.log(
                    chalk.green(
                        "You climb the stairs and find yourself in a bright room."
                    )
                );
                chooseScenario(scenarios.brightRoom);
            }
        },
        {
            description: "You see a hallway leading left. Do you go that way?",
            action: () => {
                console.log(
                    chalk.green("You walk down the hallway and find a locked door.")
                );
                chooseScenario(scenarios.lockedDoor);
            }
        },
        {
            description: "You go back to the room.",
            action: () => {
                console.log(chalk.yellow("You return to the dark room."));
                chooseScenario(scenarios.room);
            }
        },
        {
            description: "Exit",
            action: () => {
                console.log(chalk.yellow("Exiting game..."));
                process.exit(0);
            }
        }
    ],
    brightRoom: [
        {
            description: "You see a key on the table. Do you take it?",
            action: () => {
                console.log(chalk.green("You take the key."));
                player.inventory.push("key"); // Add key to inventory
                chooseScenario(scenarios.keyTaken);
            }
        },
        {
            description: "You look out the window.",
            action: () => {
                console.log(chalk.green("You see a beautiful garden outside."));
                chooseScenario(scenarios.corridor);
            }
        }
    ],
    lockedDoor: [
        {
            description: "You use the key to unlock the door.",
            action: () => {
                if (player.inventory.includes("key")) {
                    console.log(
                        chalk.green(
                            "The door unlocks and you find a treasure chest! You win!"
                        )
                    );
                    return;
                } else {
                    console.log(chalk.red("You don't have the key."));
                    player.health--; // Player loses health
                    console.log(
                        chalk.red(
                            `You lost 1 health point. Health remaining: ${displayHealth(
                                player.health
                            )}`
                        )
                    );
                    if (player.health <= 0) {
                        endGame();
                    } else {
                        chooseScenario(scenarios.corridor);
                    }
                }
            }
        },
        {
            description: "You try to open the door without a key.",
            action: () => {
                console.log(chalk.red("The door is locked."));
                player.health--; // Player loses health
                console.log(
                    chalk.red(
                        `You lost 1 health point. Health remaining: ${displayHealth(
                            player.health
                        )}`
                    )
                );
                if (player.health <= 0) {
                    endGame();
                } else {
                    chooseScenario(scenarios.corridor);
                }
            }
        }
    ],
    keyTaken: [
        {
            description: "You go back to the corridor.",
            action: () => {
                console.log(chalk.yellow("You return to the corridor."));
                chooseScenario(scenarios.corridor);
            }
        }
    ]
};

// Function to present choices to the player and proceed with the chosen scenario
function chooseScenario(choices: Choice[]) {
    inquirer
        .prompt([
            {
                type: "list",
                name: "action",
                message: "What do you do?",
                choices: choices.map((choice) => choice.description),
            }
        ])
        .then((answer) => {
            const chosenAction = choices.find(
                (choice) => choice.description === answer.action
            );
            if (chosenAction) {
                chosenAction.action();
            } else {
                console.log(chalk.red("Invalid choice! Please select a valid option."));
                chooseScenario(choices);
            }
        });
}

// Function to end the game or give remaining chances
function endGame() {
    console.log(
        chalk.red(
            `
  ███████╗██╗   ██╗██████╗ ██████╗ ██╗   ██╗███████╗
  ██╔════╝██║   ██║██╔══██╗██╔══██╗██║   ██║██╔════╝
  ███████╗██║   ██║██████╔╝██████╔╝██║   ██║███████╗
  ╚════██║██║   ██║██╔═══╝ ██╔═══╝ ██║   ██║╚════██║
  ███████║╚██████╔╝██║     ██║     ╚██████╔╝███████║
  ╚══════╝ ╚═════╝ ╚═╝     ╚═╝      ╚═════╝ ╚══════╝
  `
        )
    );
    console.log(chalk.bgRedBright("\nGame Over!\n"));

    inquirer
        .prompt([
            {
                type: "confirm",
                name: "restart",
                message: "Do you want to play again?",
            }
        ])
        .then((answer) => {
            if (answer.restart) {
                player.health = 4; // Reset player health to 4 (1 less than the original)
                player.inventory = []; // Clear player inventory
                chooseScenario(scenarios.start); // Restart the game
            } else {
                console.log(chalk.green("\nThanks for playing!"));
            }
        });
}

// Function to display health with heart symbols
function displayHealth(health: number): string {
    const heart = "\u2665"; // Heart symbol
    return chalk.red(heart.repeat(health)) + chalk.gray(heart.repeat(5 - health));
}

// Start the game with a welcome message and ASCII art
console.log(
    chalk.blue("*********************************************")
);
console.log(
    chalk.blue("*               The Adventure                *")
);
console.log(
    chalk.blue("*********************************************\n")
);
console.log(
    chalk.yellow(
        `Welcome to The Adventure! You wake up in a dark room.
   _      _                         _
  | |    | |                       | |
  | |    | | ___  _ __   ___  _ __| |_
  | |    | |/ _ \\| '_ \\ / _ \\| '__| __|
  | |____| | (_) | | | | (_) | |  | |_
  |______|_|\\___/|_| |_|\\___/|_|   \\__|
`
    )
);
chooseScenario(scenarios.start);