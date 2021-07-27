// класс с информацией по всем зданиям, позволяет строить здания
import {Resource, ResourceAmount} from "../model/resource";
import {Building, Capacity} from "../model/building";
import {HumanType} from "../model/human";
import {getResourceAmount} from "../utils/utils";

const allBuildings = [
    new Building('house', [new ResourceAmount(Resource.gold, 25)], new Capacity(HumanType.peasant, 1), [new ResourceAmount(Resource.food, 4)], []),
    new Building('barn', [new ResourceAmount(Resource.gold, 50)], new Capacity(HumanType.peasant, 2), [new ResourceAmount(Resource.food, 10)], []),
    new Building('farm', [new ResourceAmount(Resource.gold, 400), new ResourceAmount(Resource.science, 20)], new Capacity(HumanType.peasant, 10), [new ResourceAmount(Resource.food, 4), new ResourceAmount(Resource.food, 100)], []),
    new Building('incubator', [new ResourceAmount(Resource.gold, 2000), new ResourceAmount(Resource.science, 200)], new Capacity(HumanType.peasant, 25), [new ResourceAmount(Resource.food, 800), new ResourceAmount(Resource.gold, 70)], []),
    new Building('workshop', [new ResourceAmount(Resource.gold, 50)], new Capacity(HumanType.peasant, 1), [new ResourceAmount(Resource.gold, 4)], []),
    new Building('forge', [new ResourceAmount(Resource.gold, 150), new ResourceAmount(Resource.science, 20)], new Capacity(HumanType.peasant, 3), [new ResourceAmount(Resource.gold, 10)], []),
    new Building('gild', [new ResourceAmount(Resource.gold, 600), new ResourceAmount(Resource.science, 100)], new Capacity(HumanType.peasant, 10), [new ResourceAmount(Resource.gold, 80)], []),
    new Building('factory', [new ResourceAmount(Resource.gold, 5000), new ResourceAmount(Resource.science, 1000)], new Capacity(HumanType.peasant, 50), [new ResourceAmount(Resource.gold, 1000)], []),
    new Building('watchtower', [new ResourceAmount(Resource.gold, 75)], new Capacity(HumanType.soldier, 1), [new ResourceAmount(Resource.power, 5)], []),
    new Building('barracks', [new ResourceAmount(Resource.gold, 25), new ResourceAmount(Resource.science, 50)], new Capacity(HumanType.soldier, 10), [new ResourceAmount(Resource.power, 50)], []),
    new Building('castle', [new ResourceAmount(Resource.gold, 300), new ResourceAmount(Resource.science, 500)], new Capacity(HumanType.soldier, 50), [new ResourceAmount(Resource.power, 400)], []),
    new Building('theater', [new ResourceAmount(Resource.gold, 50)], new Capacity(HumanType.intellectual, 1), [new ResourceAmount(Resource.science, 10)], []),
    new Building('bookСlub', [new ResourceAmount(Resource.gold, 150), new ResourceAmount(Resource.science, 50)], new Capacity(HumanType.intellectual, 4), [new ResourceAmount(Resource.science, 50)], []),
    new Building('library', [new ResourceAmount(Resource.gold, 500), new ResourceAmount(Resource.science, 500)], new Capacity(HumanType.intellectual, 8), [new ResourceAmount(Resource.science, 500)], []),
];

export function getAllBuildings(): Building[] {
    return allBuildings;
}

export class BuildingService {

    createBuilding(name:string): Building {
        for( let i = 0; i < allBuildings.length; i++){
            if (allBuildings[i].name === name){
                return JSON.parse(JSON.stringify(allBuildings[i]));
            }
        }
        // проверить, что ресурсов на здание хватает
        // вычесть доступные ресурсы
        // поселить людей без здания в это здание
    }

    getBuildingsToBuild(currentResources: ResourceAmount[]) {
        // вернуть только те здания, которые можно построить с имеющимися ресурсами
        // этот метод вызывается в UI
        let buildingsToBuild = [];
        let currentGold = getResourceAmount(currentResources, Resource.gold);
        let currentScience = getResourceAmount(currentResources, Resource.science);
        for (let i = 0; i < allBuildings.length; i++) {
            let cost = allBuildings[i].cost;
            let goldRequired = getResourceAmount(cost, Resource.gold);
            let scienceRequired = getResourceAmount(cost, Resource.science);
            if (currentGold >= goldRequired && currentScience >= scienceRequired) {
                buildingsToBuild.push(allBuildings[i])
            }
        }
        return buildingsToBuild;
    }

    getBuildingsWithPeople(buildings: Building[]) {
        let buildingWithPeople: Building[] = [];
        for (let i = 0; i < buildings.length; i++) {
            const building = allBuildings.find(building => building.name === buildings[i].name);
            const firstObj = buildings[i].currentPopulation;
            const secondObj = building.currentPopulation;
            if (JSON.stringify(firstObj) == JSON.stringify(secondObj)) {
                buildingWithPeople.push(buildings[i])
            }
        }
        return buildingWithPeople;
    }
}