export default class Player {
    constructor(id, color) {
        this.id = id;
        this.color = color;
    }

    placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.classList.add(`p${this.id}`);
        piece.style.backgroundColor = this.color;
        piece.style.top = -50 * (y + 2);
    
        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }
}