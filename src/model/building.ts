import { Human, HumanType } from "./human"
import { Resource, ResourceAmount } from "./resource";

export class Capacity {
    humanType: HumanType;
    capacity: number;
    constructor(humanType: HumanType, capacity: number) {
        this.humanType = humanType;
        this.capacity = capacity;
    }
}

export class Building {
    name: string;
    cost: ResourceAmount[];
    capacity: Capacity;
    benefit: ResourceAmount[];
    currentPopulation: Human[]; // когда здание строится или человек рождается, этот массив заполняется
    constructor(name: string, cost: ResourceAmount[], capacity: Capacity, benefit: ResourceAmount[], currentPopulation: Human[]) {
        this.name = name;
        this.cost = cost,
            this.capacity = capacity,
            this.benefit = benefit,
            this.currentPopulation = currentPopulation
    }
    addHuman(human: Human) {
        // добавить человека в здание
        this.currentPopulation.push(human);
        human.building = this;
    }
    addHumans(humans: Human[]) {
        let free = Math.min(this.capacity.capacity - this.currentPopulation.length, humans.length);
        for (let i = 0; i < free; i++) {
            this.addHuman(humans[i]);
        }
    }
    isPopulated() {
        return this.currentPopulation.length === this.capacity.capacity;
    }
    getHumanType() {
        return this.capacity.humanType;
    }
}