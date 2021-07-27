import {Resource, ResourceAmount} from "./resource";
import {Building} from "./building";

export enum HumanType {
    peasant = "peasant",
    soldier = "soldier",
    intellectual = "intellectual"
}

export class Human {
    type: HumanType;
    building: Building; // когда человек добавляется к зданию, это поле запонляется

    constructor(humanType: HumanType) {
        this.type = humanType;
    }
    addBuilding(building: Building){
        building.currentPopulation.push(this);
    }
}
export function createOneHuman(humanType: HumanType, amount: number) {
    return new Human(humanType)
}
export function createHuman(humanType: HumanType, amount: number) {
    let result: Human[] = [];
    for (let i = 0; i < amount; i++) {
        result.push(new Human(humanType));
    }
    return result;
}

