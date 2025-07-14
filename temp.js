
import { get_game_time, create_rectangle, create_sprite, create_text, query_position, update_color, update_position, update_scale, update_text, update_to_top, set_fps, get_loop_count, enable_debug, debug_log, input_key_down, gameobjects_overlap, update_loop, build_game, create_audio, loop_audio, stop_audio, play_audio } from "arcade_2d";
// enable_debug(); // Uncomment this to see debug info

// Constants
set_fps(30);

const size = 600;
const unit = 20;
const grid = size / unit;
const background = create_sprite("https://labs.phaser.io/assets/games/germs/background.png");


// Create Sprite Gameobjects
// update_scale(create_sprite("https://labs.phaser.io/assets/games/germs/background.png"), [4,4]); // Background
// const food = create_sprite("https://labs.phaser.io/assets/sprites/tomato.png");
const player = create_sprite("https://labs.phaser.io/assets/sprites/tomato.png");
// const _1 = create_sprite("https://raw.githubusercontent.com/1358id/SICP/refs/heads/main/img/1.png");
// const _2 = create_sprite("https://raw.githubusercontent.com/1358id/SICP/refs/heads/main/img/2.png");

// const portals = [[create_sprite("https://raw.githubusercontent.com/1358id/SICP/refs/heads/main/img/1.png"), create_sprite("https://raw.githubusercontent.com/1358id/SICP/refs/heads/main/img/1.png")]
//                 ,[create_sprite("https://raw.githubusercontent.com/1358id/SICP/refs/heads/main/img/2.png"), create_sprite("https://raw.githubusercontent.com/1358id/SICP/refs/heads/main/img/2.png")]];


// for (let i = 0; i < 1000; i = i + 1) {
//   snake[i] = update_color(update_position(create_rectangle(unit, unit), [-unit / 2, -unit / 2]),
//       [127 + 128 * math_sin(i / 20), 127 + 128 * math_sin(i / 50), 127 + 128 * math_sin(i / 30), 255]); // Store offscreen
// }
// const snake_head = update_color(update_position(create_rectangle(unit * 0.9, unit * 0.9), [-unit / 2, -unit / 2]), [0, 0, 0 ,0]); // Head

let move_dir = [0, 0];

// Other functions
const add_vec = (v1, v2) => [v1[0] + v2[0], v1[1] + v2[1]];
const bound_vec = v => [(v[0] + size) % size, (v[1] + size) % size];

let turn_key = false;
let turn_key_flg = false;
function input() {

   if (input_key_down("w")) {
	if(turn_key) {
		move_dir = [1, 0];
	}
	else {
       move_dir = [-1, 0];
	}
       play_audio(move);
   } else if (input_key_down("a")) {
	if(turn_key) {
		move_dir = [0, 1];
	}
	else {
       move_dir = [0, -1];
	}
       play_audio(move);
   } else if (input_key_down("s")) {
	if(turn_key) {
		move_dir = [-1, 0];
	}
	else {
       move_dir = [1, 0];
	}
       play_audio(move);
   } else if (input_key_down("d")) {
       if(turn_key) {
		move_dir = [0, -1];
	}
	else {
       move_dir = [0, 1];
	}
       play_audio(move);
   }
}
let alive = true;

// Create Text Gameobjects
// const score = update_position(create_text("Score: "), [size - 60, 20]);
// const game_text = update_color(update_scale(update_position(create_text(""), [size / 2, size / 2]), [2, 2]), [0, 0, 0, 255]);
// const text = create_text("Hello, world!");

// Audio
const eat = create_audio("https://labs.phaser.io/assets/audio/SoundEffects/key.wav", 1);
const lose = create_audio("https://labs.phaser.io/assets/audio/stacker/gamelost.m4a", 1);
const move = create_audio("https://labs.phaser.io/assets/audio/SoundEffects/alien_death1.wav", 1);
const bg_audio = play_audio(loop_audio(create_audio("https://labs.phaser.io/assets/audio/tech/bass.mp3", 0.5)));

// Create Update loop


const map = [];
const map_filled = [];
const mapobj = [];
for (let i = 0; i < grid; i = i + 1) {
    map[i] = [];
    map_filled[i] = [];
    for (let j = 0; j < grid; j = j + 1) { 
        map[i][j] = update_position(create_sprite("https://raw.githubusercontent.com/1358id/SICP/refs/heads/main/img/black.png"), [i * unit+unit/2, j * unit+unit/2]); 
        map_filled[i][j] = update_position(create_sprite("https://raw.githubusercontent.com/1358id/SICP/refs/heads/main/img/white_20x20.png"), [-unit/2, -unit/2]); 
    }
}

const mp = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  
            [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ];
const obj = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  
            [0, 0, 0, 2, 0, 0, 0,11, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0,11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0,12, 0, 0, 0, 0,-0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 3, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0,-0, 0, 0, 0, 0,-0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ];

// let ud1 = [];


// let portal_cnt = [0,0,0,0,0,0,0,0,0,0];
update_scale(background, [4,4]);

let k = 1;

let x = 0;
let y = 0;

let to_be_init = true;
function init() {
    if (!to_be_init) {
        return undefined;
    }
    to_be_init = false;
    for (let i = 0; i < grid; i = i + 1) {
        mapobj[i] = [];
        for (let j = 0; j < grid; j = j + 1) { 
            mapobj[i][j] = undefined;
            if (obj[i][j] >= 10) {
                mapobj[i][j] = update_position(create_sprite("https://raw.githubusercontent.com/1358id/SICP/refs/heads/main/img/portal_20x20.png"), [j * unit + unit / 2, i * unit + unit / 2]); 
                // update_position(mapobj[i][j], [j * unit + unit / 2, i * unit + unit / 2]);
                // update_to_top(mapobj[i][j]);   
                
            }
			if (obj[i][j] === 3) {
				mapobj[i][j] = update_position(create_sprite("https://raw.githubusercontent.com/1358id/SICP/refs/heads/main/img/lr1.png"), [j * unit + unit / 2, i * unit + unit / 2]); 
			}
			if (obj[i][j] === 4) {
				mapobj[i][j] = update_position(create_sprite("https://raw.githubusercontent.com/1358id/SICP/refs/heads/main/img/ud1.png"), [j * unit + unit / 2, i * unit + unit / 2]); 
			}
			if (obj[i][j] === -1) {
				mapobj[i][j] = update_position(create_sprite("https://raw.githubusercontent.com/1358id/SICP/refs/heads/main/img/tgt.png"), [j * unit + unit / 2, i * unit + unit / 2]); 
			}
            // map[i][j] = update_color(update_position(create_rectangle(unit, unit), [i * unit+unit/2, j * unit+unit/2]),
            //             [255,255,255,255]); 
            
        }
    }
}

function portal(_x, _y) {
    const id = obj[_x][_y];
    for (let i = 0; i < grid; i = i + 1) {
         for (let j = 0; j < grid; j = j + 1) {
             if(i !== _x || j !== _y) {
                 if (obj[i][j] === id) {
                     x = i;
                     y = j;
                     return undefined;
                 }
             }
         }
    }
}

function go() {
    if(move_dir[0] === 0 && move_dir[1] === 0) {
        return false;
    }
    let newx = x + move_dir[0];
    let newy = y + move_dir[1];
    if (mp[newx][newy] === 1) {
        return false;
    }
    else if (obj[newx][newy] >= 10) {
        mp[newx][newy] = 3;
        portal(newx, newy);
        return true;
    }
	else if (obj[newx][newy] === 3 && move_dir[1] === 0) {
		return false;
	}
	else if (obj[newx][newy] === 4 && move_dir[0] === 0) {
		return false;
	}
    else {
        // mp[x][y] = 3;
        if (mp[x][y] === 0) {
            mp[x][y] = 3;
        }
        x = newx;
        y = newy;
        if (mp[x][y] === 0) {
            mp[x][y] = 3;
        }
		if (obj[x][y] === -1) {
			turn_key_flg = true;
		}
        return true;
    }
}
function getxy() {
    for (let i = 0; i < grid; i = i + 1) {
         for (let j = 0; j < grid; j = j + 1) {
             if(obj[i][j] === 2) {
                 obj[i][j] = 0;
                 x = i;
                 y = j;
                 mp[x][y] = 3;
                 return undefined;
             }
         }
    }
}
/*
function upd_map() {
    // for (let i = 0; i < 10; i = i + 1) {
    //     portal_cnt[i] = 0;
    // }
    for (let i = 0; i < grid; i = i + 1) {
         for (let j = 0; j < grid; j = j + 1) {
            //  if (obj[i][j] !== 0) {
            //      debug_log(i*100+j);
            //      debug_log(obj[i][j]);
            //  } 
             if (mp[i][j] === 0) { 
                 update_position(map[i][j], [-2*unit, -2*unit]); 
                 update_position(map_filled[i][j], [-2*unit, -2*unit]); 
             }
             else if (mp[i][j] === 1) {
                //  debug_log(i*100+j);
                 update_position(map[i][j],[j*unit+unit/2, i*unit+unit/2]);
                 update_position(map_filled[i][j], [-2*unit, -2*unit]); 
             }
             else if (mp[i][j] === 3) {
                //  debug_log(i*100+j);
                update_position(map[i][j], [-2*unit, -2*unit]); 
                update_position(map_filled[i][j],[j*unit+unit/2, i*unit+unit/2]);
             }
             if (mapobj[i][j] !== undefined) {
                update_position(mapobj[i][j], [j*unit+unit/2, i*unit+unit/2]);
                update_to_top(mapobj[i][j]);
                //  debug_log(i, j);
                //  const id = obj[i][j] - 10;
                //  update_position(portals[id][portal_cnt[id]], [j*unit+unit/2, i*unit+unit/2]);
                //  update_to_top(portals[id][portal_cnt[id]]);
                //  portal_cnt[id] = portal_cnt[id] + 1;
                //  debug_log(portal_cnt[id]);
                //  update_color(update_position(map[i][j], [j * unit+unit/2, i * unit+unit/2]),
                //     [mp[i][j] * 20, mp[i][j] * 5, mp[i][j] * 20 ,255]);
             }
         }
     }
     update_position(player, [y*unit+unit/2, x*unit+unit/2]);
     update_to_top(player);
}
	 */

function upd_map() {
    for (let i = 0; i < grid; i = i + 1) {
        for (let j = 0; j < grid; j = j + 1) {

            if (mp[i][j] === 0) {
                update_position(map[i][j],       [-2 * unit, -2 * unit]);
                update_position(map_filled[i][j],[-2 * unit, -2 * unit]);
            } else if (mp[i][j] === 1) {
                update_position(map[i][j],       [j * unit + unit / 2, i * unit + unit / 2]);
                update_position(map_filled[i][j],[-2 * unit, -2 * unit]);
            } else if (mp[i][j] === 3) {
                update_position(map[i][j],       [-2 * unit, -2 * unit]);
                update_position(map_filled[i][j],[j * unit + unit / 2, i * unit + unit / 2]);
            }

            // if (mapobj[i][j] !== undefined) {
            //     update_position(mapobj[i][j], [j * unit + unit / 2, i * unit + unit / 2]);
            //     update_to_top(mapobj[i][j]);      // --------------------------------------------------------
            // }
        }
    }

    update_position(player, [y * unit + unit / 2, x * unit + unit / 2]);
    update_to_top(player);                        
}

// update_scale(background, [4,4]);
let las = false;
update_loop(game_state => {
    init();
    debug_log(get_game_time());
    
    getxy();
    // 
      // Background // update_text(score, "Score: " + stringify(snake_length - start_length));
     upd_map();
    //  update_position(food, [math_floor(math_random() * dwasasdwawagrid) * unit + unit / 2, math_floor(math_random() * grid) * unit + unit / 2]);
     if (las === false) {
         input();
     }
     debug_log(move_dir);
     if (go()) {
         upd_map();
        //  debug_log(x);
        //  debug_log(y);
         las = true;
     }
     else {
         las = false;
		 if (turn_key_flg) {
			turn_key_flg = false;
			turn_key = !turn_key;
		 }
     }
     update_position(player, [y * unit + unit / 2, x * unit + unit / 2]);
    update_to_top(player);
    //  debug_log("work");
    //  k = k + 1;
    //  debug_log(k);
    //  if (k === 10) {
    //      return undefined;
    //  } 
  // update_position(text, [math_floor(math_random() * grid) * unit + unit / 2, math_floor(math_random() * grid) * unit + unit / 2]);
////    update_position(create_text("Hello world!"), [1, 2]);
  // if (!alive) {
  //     update_text(game_text, "Game Over!");
  //     return undefined;
  // }

  // // Move snake
  // for (let i = snake_length - 1; i > 0; i = i - 1) {
  //     update_position(snake[i], query_position(snake[i - 1]));
  // }
  // update_position(snake[0], query_position(snake_head)); // Update head
  // update_position(snake_head, bound_vec(add_vec(query_position(snake_head), move_dir))); // Update head
  // debug_log(query_position(snake[0])); // Head

  // input();

  // // Add food
  // if (eaten) {
  //     update_position(food, [math_floor(math_random() * grid) * unit + unit / 2, math_floor(math_random() * grid) * unit + unit / 2]);
  //     eaten = false;
  // }

  // // Eat food
  // if (get_loop_count() > 1 && gameobjects_overlap(snake_head, food)) {
  //     eaten = true;
  //     snake_length = snake_length + food_growth;
  //     play_audio(eat);
  // }
  // debug_log(snake_length); // Score

  // // Check collision
  // if (get_loop_count() > start_length) {
  //     for (let i = 0; i < snake_length; i = i + 1) {
  //         if (gameobjects_overlap(snake_head, snake[i])) {
  //             alive = false;
  //             play_audio(lose);
  //             stop_audio(bg_audio);
  //         }
  //     }
  // }
});
build_game();
