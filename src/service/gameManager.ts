import { Building } from "../model/building";
import { createHuman, Human, HumanType } from "../model/human";
import { Resource, ResourceAmount } from "../model/resource";
import { ResourceService } from "./resourceService";
import { BuildingService } from "./buildingService";
import { scheduleJob } from 'node-schedule';
import { getFreeBuildingByHumanType, getFreeHumanByType, getResourceAmount } from "../utils/utils";

export class GameManager {
    buildings: Building[];
    population: Human[];
    resources: ResourceAmount[];

    resourceService = new ResourceService();
    buildingService = new BuildingService();

    constructor() {
        console.log('start game manager')
        this.buildings = [];
        this.population = [...createHuman(HumanType.peasant, 3),
        ...createHuman(HumanType.intellectual, 1),
        ...createHuman(HumanType.soldier, 1)]

        this.resources = [
            new ResourceAmount(Resource.food, 100),
            new ResourceAmount(Resource.gold, 150),
            new ResourceAmount(Resource.science, 0),
            new ResourceAmount(Resource.power, 0)
        ]

        const consumeJob = scheduleJob('consumeResources', '*/1 * * * *', () => this.consumeResources());
        const generatePeopleJob = scheduleJob('generatePeople', '*/1 * * * *', () => this.generatePeople());
        const generateResourcesJob = scheduleJob('generatePeople', '*/2 * * * *', () => this.generateResources());
        // добавить вызов методов по расписанию
        // добавить возможность постройки зданий
        // добавить генерацию ресурсов
        // добавить привязку человека к зданию
    }

    build(name) {
        // постройка зданий
        console.log('build')
        let building = this.buildingService.createBuilding(name);
        this.buildings.push(building);
        let amount = getResourceAmount(building.cost, Resource.gold)
        this.resourceService.consumeResource(Resource.gold, amount, this.resources);
        let humanType = building.getHumanType();
        let freeHuman = getFreeHumanByType(this.population, humanType);
        building.addHumans(freeHuman);
    }

    // every 1 minute
    consumeResources() {
        console.log('consume resources')
        this.resourceService.deductResources(this.population, this.resources);
        if (this.resourceService.noResourcesLeft(this.resources)) {
            // stop game
        }
    }

    // по расписанию
    // добавление ресурсов которые генерируют здания
    // every 2 minute

    generateResources() {
        console.log('generate resources')
        let myBuidings = this.buildingService.getBuildingsWithPeople(this.buildings);
        if (myBuidings.length != 0) {
            this.resourceService.createResources(myBuidings, this.resources)
        }
    }

    // по расписанию 12 min
    runBarbariansRaid() {

    }

    // каждые 5 минут рождение людей
    generatePeople() {
        console.log('generate people');
        let peasantCount = this.population.filter(h => h.type === HumanType.peasant).length;
        let peasantPairs = Math.trunc(peasantCount / 2); // каждые 5 минут 2 крестьян могут родить одного персонажа
        for (let i = 0; i < peasantPairs; i++) {
            let probability = Math.random();
            if ((probability < 0.1)) {
                this.population.push(...createHuman(HumanType.intellectual, 1));
                getFreeBuildingByHumanType(this.buildings, HumanType.intellectual)
            } else if ((probability < 0.4)) {
                this.population.push(...createHuman(HumanType.soldier, 1));
                getFreeBuildingByHumanType(this.buildings, HumanType.soldier)
            } else if ((probability < 0.6)) {
                let humans = createHuman(HumanType.peasant, 1)
                this.population.push(humans[0]);
                let building = getFreeBuildingByHumanType(this.buildings, humans[0].type);                    
            }
        }
    }
    // получить ресурсы которые у нас есть
    getAllResourse(): ResourceAmount[] {
        return this.resources
    }

    // получить людей которые у нас есть
    getAllPeople(): Human[] {
        return this.population;
    }

    // пщлучить доступные здания
    getAvailableBuildings() {
        return this.buildingService.getBuildingsToBuild(this.resources);
    }
}
