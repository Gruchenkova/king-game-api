import { Building } from "../model/building";
import { createHuman, createOneHuman, Human, HumanType } from "../model/human";
import { Resource, ResourceAmount } from "../model/resource";
import { ResourceService } from "./resourceService";
import { BuildingService } from "./buildingService";
import { scheduleJob } from 'node-schedule';
import { getFreeBuildingByHumanType, getFreeHumanByType, getResourceAmount } from "../utils/utils";
import { gameManager } from "src/Controller";

export class GameManager {
    buildings: Building[];
    population: Human[];
    resources: ResourceAmount[];

    resourceService = new ResourceService();
    buildingService = new BuildingService();

    consumeJob;
    generatePeopleJob;
    generateResourcesJob;
    runBarbariansRaidJob;

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

         this.consumeJob = scheduleJob('consumeResources', '*/1 * * * *', () => this.consumeResources());
         this.generatePeopleJob = scheduleJob('generatePeople', '*/2 * * * *', () => this.generatePeople());
         this.generateResourcesJob = scheduleJob('generatePeasantResourses', '*/2 * * * *', () => this.generatePeasantResourses());
         this.runBarbariansRaidJob = scheduleJob('runBarbariansRaid', '*/12 * * * *', () => this.runBarbariansRaid());
    }

    build(name : string) {
        // постройка зданий
        console.log('build')
        let newBuilding = this.buildingService.createBuilding(name);
        this.buildings.push(newBuilding);
        let amount = getResourceAmount(newBuilding.cost, Resource.gold)
        this.resourceService.consumeResource(Resource.gold, amount, this.resources);
        let humanType = newBuilding.getHumanType();
        let freeHuman = getFreeHumanByType(this.population, humanType);
        newBuilding.addHumans(freeHuman);
        if (humanType !== HumanType.peasant){
            this.generateResources(newBuilding);
        }
    }

    // every 1 minute
    consumeResources() {
        console.log('consume resources')
        this.resourceService.deductResources(this.population, this.resources);
        if (this.resourceService.noResourcesLeft(this.resources)) {
            // stop game
            this.consumeJob.cancel();
            this.generatePeopleJob.cancel();
            this.generateResourcesJob.cancel();
            this.runBarbariansRaidJob.cancel();
        }
    }

    // по расписанию
    // добавление ресурсов которые генерируют здания
    // every 2 minute
    generatePeasantResourses() {
        console.log('generate Peasant`s resources')
        let myBuidings = this.buildingService.getBuildingsWithPeople(this.buildings);
        if (myBuidings.length != 0) {
            this.resourceService.createResources(myBuidings, this.resources)
        }
    }
    generateResources(building:Building) {
        console.log('generate resources');
        if(building.currentPopulation.length === building.capacity.capacity){
            this.resourceService.onceCreateResources(building, this.resources)
        }
    }

    // по расписанию 12 min
    runBarbariansRaid() {
        console.log('raid by barbarians')
        let gold = getResourceAmount(this.resources, Resource.gold);
        let power = getResourceAmount(this.resources, Resource.power);
        let food = getResourceAmount(this.resources, Resource.food);
        let result = 1 / (1 + Math.pow(Math.E , -(power / gold)));
        if(result < 0.6){
            this.resourceService.consumeResource(Resource.food,  Math.round(food * 0.3), this.resources);
            this.resourceService.consumeResource(Resource.gold, Math.round(gold * 0.3), this.resources);
        }
    }

    // каждые 5 минут рождение людей
    generatePeople() {
        console.log('generate people');
        let peasantCount = this.population.filter(h => h.type === HumanType.peasant).length;
        let peasantPairs = Math.trunc(peasantCount / 2); // каждые 5 минут 2 крестьян могут родить одного персонажа
        for (let i = 0; i < peasantPairs; i++) {
            let human : Human;
            let probability = Math.random();
            if ((probability < 0.1)) {
                human = createOneHuman(HumanType.intellectual, 1);
                this.population.push(human);
            } else if ((probability < 0.4)) {
                human = createOneHuman(HumanType.soldier, 1);
                this.population.push(human);
            } else if ((probability < 0.6)) {
                human = createOneHuman(HumanType.peasant, 1);
                this.population.push(human);                 
            }
            if (human !== undefined){
                let buildings = getFreeBuildingByHumanType(this.buildings, human.type);
                if (buildings.length !== 0) {
                    buildings[0].currentPopulation.push(human);
                    human.addBuilding(buildings[0]);    
                } 
            }       
        }
    }
    // получить ресурсы которые у нас есть
    getAllResourse(): ResourceAmount[] {
        console.log(this.resources)
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
