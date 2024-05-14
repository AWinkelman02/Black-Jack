class Player {
    constructor(name, lowCount, highCount, finalScore, bust){
        this.name = name;
        this.cards = [];
        this.lowCount = lowCount;
        this.highCount = highCount;
        this.finalScore = finalScore;
        this.bust = bust;
    }
}

export { Player }