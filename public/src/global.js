SummerCoding = {

    /* Here we've just got some global level vars that persist regardless of State swaps */
    score: 0,

    /* If the music in your game needs to play through-out a few State swaps, then you could reference it here */
    music: null,

    GameObjects: {
        BRICK: 0,
        STREET: 1,
        FUEL: 2,
        STAR: 3,
        GRASS: 4,
        STONE: 5,
        WATER: 6
    },

    TILE_SIZE: 48,
    CACHE_SIZE: 25 * 25,

    VIEWPORT_WIDTH: 800,
    VIEWPORT_HEIGHT: 600,

    TANK_VECLOVITYS: [4, 6],

    TANK_STATES: {
        RUN: 0,
        INVALID_LOCATION: 1,
        EMPTY_FUEL: 2,
        END: 4,
        INVALID_PATH: 5,
        OUT_OF_MAP: 6,
        STOP: 7
    },

    PLAY_STATES: {
        PLAY: 0,
        STOP: 1
    },

    screenWidth: 1100,
    screenHeight: 650,

    round: 0,
};

SummerCoding.UI = {};

SummerCoding.Map = {};