// Dungeon management
class Dungeon {
    constructor() {
        this.width = CONFIG.GRID_WIDTH;
        this.height = CONFIG.GRID_HEIGHT;
        this.grid = [];
        this.entrance = { x: 0, y: Math.floor(this.height / 2) };
        this.exit = { x: this.width - 1, y: Math.floor(this.height / 2) };
        this.initializeGrid();
    }

    initializeGrid() {
        this.grid = [];
        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.grid[y][x] = {
                    x,
                    y,
                    type: 'empty',
                    trap: null,
                    monster: null,
                    bait: null,
                    room: null,
                    adventurers: []
                };
            }
        }
        // Mark entrance and exit
        this.grid[this.entrance.y][this.entrance.x].type = 'entrance';
        this.grid[this.exit.y][this.exit.x].type = 'exit';
    }

    getCell(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }
        return this.grid[y][x];
    }

    placeTrap(x, y, trapType) {
        const cell = this.getCell(x, y);
        if (!cell || cell.type !== 'empty' || cell.trap || cell.monster) {
            return false;
        }

        const trapData = TRAPS[trapType];
        if (!trapData || !trapData.unlocked) {
            return false;
        }

        cell.trap = {
            type: trapType,
            ...trapData,
            active: true,
            triggered: false
        };
        return true;
    }

    placeMonster(x, y, monsterType) {
        const cell = this.getCell(x, y);
        if (!cell || cell.type !== 'empty' || cell.trap || cell.monster) {
            return false;
        }

        const monsterData = MONSTERS[monsterType];
        if (!monsterData || !monsterData.unlocked) {
            return false;
        }

        cell.monster = {
            type: monsterType,
            ...monsterData,
            currentHp: monsterData.hp,
            alive: true
        };
        return true;
    }

    placeBait(x, y, baitType) {
        const cell = this.getCell(x, y);
        if (!cell || cell.type !== 'empty' || cell.bait) {
            return false;
        }

        const baitData = BAIT_ITEMS[baitType];
        if (!baitData || !baitData.unlocked) {
            return false;
        }

        cell.bait = {
            type: baitType,
            ...baitData
        };
        return true;
    }

    placeRoom(x, y, roomType) {
        const cell = this.getCell(x, y);
        if (!cell || cell.type !== 'empty') {
            return false;
        }

        const roomData = ROOM_TYPES[roomType];
        if (!roomData || !roomData.unlocked) {
            return false;
        }

        cell.room = {
            type: roomType,
            ...roomData
        };
        return true;
    }

    removeContent(x, y) {
        const cell = this.getCell(x, y);
        if (!cell || cell.type === 'entrance' || cell.type === 'exit') {
            return false;
        }

        cell.trap = null;
        cell.monster = null;
        cell.bait = null;
        cell.room = null;
        cell.type = 'empty';
        return true;
    }

    clearAllContent() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.grid[y][x];
                if (cell.type !== 'entrance' && cell.type !== 'exit') {
                    cell.trap = null;
                    cell.monster = null;
                    cell.bait = null;
                    cell.room = null;
                    cell.type = 'empty';
                }
            }
        }
    }

    getNeighbors(x, y) {
        const neighbors = [];
        const directions = [
            { dx: 1, dy: 0 },   // right
            { dx: 0, dy: 1 },   // down
            { dx: -1, dy: 0 },  // left
            { dx: 0, dy: -1 }   // up
        ];

        for (const dir of directions) {
            const newX = x + dir.dx;
            const newY = y + dir.dy;
            const cell = this.getCell(newX, newY);
            if (cell) {
                neighbors.push(cell);
            }
        }
        return neighbors;
    }

    // A* Pathfinding - heroes intelligently navigate to exit (or bait!)
    findPath(startX, startY, targetX, targetY, adventurerGreed = 0.5) {
        const start = this.getCell(startX, startY);
        const goal = this.getCell(targetX, targetY);
        
        if (!start || !goal) return null;

        const openSet = [start];
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();

        // Initialize scores
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.grid[y][x];
                gScore.set(cell, Infinity);
                fScore.set(cell, Infinity);
            }
        }

        gScore.set(start, 0);
        fScore.set(start, this.heuristic(start, goal));

        while (openSet.length > 0) {
            // Get cell with lowest fScore
            let current = openSet[0];
            let lowestF = fScore.get(current);
            for (let i = 1; i < openSet.length; i++) {
                const f = fScore.get(openSet[i]);
                if (f < lowestF) {
                    lowestF = f;
                    current = openSet[i];
                }
            }

            // Reached goal
            if (current.x === goal.x && current.y === goal.y) {
                return this.reconstructPath(cameFrom, current);
            }

            // Remove current from openSet
            const index = openSet.indexOf(current);
            openSet.splice(index, 1);

            // Check neighbors
            const neighbors = this.getNeighbors(current.x, current.y);
            for (const neighbor of neighbors) {
                // Calculate cost - adjusted by greed
                let moveCost = 1;
                
                // Greedy heroes ignore danger more
                if (neighbor.monster && neighbor.monster.alive) {
                    moveCost = Math.max(1, 5 * (1 - adventurerGreed)); // Greedy = lower cost
                }
                if (neighbor.trap && neighbor.trap.active) {
                    moveCost = Math.max(1, 3 * (1 - adventurerGreed)); // Greedy = lower cost
                }

                // Add randomness - heroes make mistakes!
                moveCost += Math.random() * 0.5;

                const tentativeGScore = gScore.get(current) + moveCost;

                if (tentativeGScore < gScore.get(neighbor)) {
                    cameFrom.set(neighbor, current);
                    gScore.set(neighbor, tentativeGScore);
                    fScore.set(neighbor, tentativeGScore + this.heuristic(neighbor, goal));

                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    }
                }
            }
        }

        // No path found, move toward exit anyway
        return this.getSimpleNextStep(startX, startY, targetX, targetY);
    }

    heuristic(cellA, cellB) {
        // Manhattan distance
        return Math.abs(cellA.x - cellB.x) + Math.abs(cellA.y - cellB.y);
    }

    reconstructPath(cameFrom, current) {
        const path = [current];
        while (cameFrom.has(current)) {
            current = cameFrom.get(current);
            path.unshift(current);
        }
        return path;
    }

    getSimpleNextStep(fromX, fromY, targetX, targetY) {
        const neighbors = this.getNeighbors(fromX, fromY);
        let bestCell = null;
        let bestDistance = Infinity;

        for (const neighbor of neighbors) {
            const distance = Math.abs(neighbor.x - targetX) + Math.abs(neighbor.y - targetY);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestCell = neighbor;
            }
        }
        return bestCell ? [this.getCell(fromX, fromY), bestCell] : null;
    }

    // Get next step from pathfinding
    getNextStep(fromX, fromY, targetX, targetY, adventurerGreed = 0.5) {
        const path = this.findPath(fromX, fromY, targetX, targetY, adventurerGreed);
        if (path && path.length > 1) {
            return path[1]; // Return next step in path
        }
        return null;
    }

    // Find nearest bait
    findNearestBait(fromX, fromY) {
        let nearestBait = null;
        let nearestDistance = Infinity;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.grid[y][x];
                if (cell.bait) {
                    const distance = Math.abs(x - fromX) + Math.abs(y - fromY);
                    if (distance < nearestDistance) {
                        nearestDistance = distance;
                        nearestBait = cell;
                    }
                }
            }
        }

        return nearestBait;
    }

    toSaveData() {
        const saveGrid = [];
        for (let y = 0; y < this.height; y++) {
            saveGrid[y] = [];
            for (let x = 0; x < this.width; x++) {
                const cell = this.grid[y][x];
                saveGrid[y][x] = {
                    type: cell.type,
                    trap: cell.trap ? cell.trap.type : null,
                    monster: cell.monster ? {
                        type: cell.monster.type,
                        currentHp: cell.monster.currentHp
                    } : null
                };
            }
        }
        return saveGrid;
    }

    loadFromData(saveGrid) {
        if (!saveGrid || saveGrid.length !== this.height) return;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const saveCell = saveGrid[y][x];
                const cell = this.grid[y][x];

                if (saveCell.trap) {
                    this.placeTrap(x, y, saveCell.trap);
                }

                if (saveCell.monster) {
                    this.placeMonster(x, y, saveCell.monster.type);
                    if (cell.monster) {
                        cell.monster.currentHp = saveCell.monster.currentHp;
                    }
                }
            }
        }
    }
}
