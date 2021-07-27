import { Building } from "src/model/building";
import { Human, HumanType } from "src/model/human";
import { Resource, ResourceAmount } from "../model/resource";

export function getResourceAmount(resources: ResourceAmount[], resourceType: Resource) {
    // пройти по массиву ресурсов и вернуть количество ресурсов с типом resourceType
    for (let i = 0; i < resources.length; i++) {
        if (resources[i].resourceType === resourceType) {
            return resources[i].amount;
        }
    }
    return 0;
}
export function getFreeHumanByType(population: Human[], humanType: HumanType) {
    return population.filter(human => human.type === humanType && !human.building);
}
export function getFreeBuildingByHumanType(buildings: Building[], humanType: HumanType) {
    return buildings.filter(building => building.capacity.humanType === humanType && building.currentPopulation.length < building.capacity.capacity);
}