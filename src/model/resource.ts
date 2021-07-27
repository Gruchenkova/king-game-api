export enum Resource {
    gold = "gold",
    power = "power",
    science = "science",
    food = "food"
}

export class ResourceAmount {
    resourceType: Resource;
    amount: number;

    constructor(resource: Resource, numb: number) {
        this.resourceType = resource;
        this.amount = numb;
    }
}
