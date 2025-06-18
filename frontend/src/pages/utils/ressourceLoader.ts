import { EnemyImg, PlayerImg } from "./types";
import rat0 from '../../Global/Enemies/Rat/rat0.png'
import rat1 from '../../Global/Enemies/Rat/rat1.png'
import trashBox0 from '../../Global/Enemies/Trash1/poub0.png'
import trashBox1 from '../../Global/Enemies/Trash1/poub1.png'
import trashBag0 from '../../Global/Enemies/Trash2/poubelle0.png'
import trashBag1 from '../../Global/Enemies/Trash2/poubelle2.png'
import player0 from '../../Global/player/PosePlayer.png'
import player1 from '../../Global/player/AttackPlayer.png'
import clickerbg from '../../Global/clicker-background.webp'


export const enemiesList : EnemyImg[] = [
    {
        name: "Rat",
        sprites:[
            rat0,
            rat1
        ]
    },
    {
        name:"Trash Box",
        sprites:[
            trashBox0,
            trashBox1
        ]
    },
    {
        name: "Trash Bag",
        sprites:[
           trashBag0,
           trashBag1
        ]
    },
]

export const playerSprites : PlayerImg = {
    sprites: [
        player0,
        player1
    ],
}

export const clickerBackground = clickerbg;


   
