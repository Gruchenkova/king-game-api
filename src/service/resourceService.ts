import { Resource, ResourceAmount } from "../model/resource";
import { Human, HumanType } from "../model/human";
import { Building } from "../model/building";
import { getResourceAmount } from "../utils/utils";

// интерфейс для функции уменьшения еоличества ресурсов
interface ConsumerFunction {
    (resources: ResourceAmount[]): void;
}

// класс ресурсы
export class ResourceService {

    consumingBehaviour = new Map<HumanType, ConsumerFunction>();

    // метод который уменьшает количество ресурсов
    consumeResource(resourceType: Resource, amountToConsume: number, availableResources: ResourceAmount[]) {
        availableResources.filter(r => r.resourceType === resourceType)
            .forEach(r => r.amount = r.amount - amountToConsume);
    }

    // метод который увеличивает количество ресурсов
    generateResource(resourceType: Resource, amountToGenerate: number, availableResources: ResourceAmount[]) {
        availableResources.filter(r => r.resourceType === resourceType)
            .forEach(r => r.amount = r.amount + amountToGenerate);
    }

    constructor() {
        // то количество ресурсов, которое потребляет каждый вид 
        this.consumingBehaviour.set(HumanType.peasant, (resources => {
            this.consumeResource(Resource.food, 2, resources);
        }));

        this.consumingBehaviour.set(HumanType.intellectual, (resources => {
            this.consumeResource(Resource.food, 1, resources);
        }));

        this.consumingBehaviour.set(HumanType.soldier, (resources => {
            this.consumeResource(Resource.food, 4, resources);
            this.consumeResource(Resource.gold, 1, resources);
        }));
    }

    // отнимает ресурсы
    deductResources(population: Human[], resources: ResourceAmount[]) {
        population.forEach(h => this.consumingBehaviour.get(h.type)(resources))
    }
    onceCreateResources(building: Building, resources: ResourceAmount[]) {
        let r = building.benefit;
        for (let k = 0; k < r.length; k++) {
            this.generateResource(r[k].resourceType, r[k].amount, resources)
        }
    }
    // добавляем ресурсы
    createResources(buildings: Building[], resources: ResourceAmount[]) {
        // TODO здесь каждое заполненное здание создает ресурсы и добавляет их в resources
        for (let i = 0; i < buildings.length; i++) {
            let r = buildings[i].benefit;
            if (buildings[i].capacity.humanType === HumanType.peasant) {
                for (let k = 0; k < r.length; k++) {
                    this.generateResource(r[k].resourceType, r[k].amount, resources)
                }
            }
        }
    }

    // проверяем наличие ресурсов
    noResourcesLeft(resources: ResourceAmount[]) {
        return getResourceAmount(resources, Resource.gold) <= 0 ||
            getResourceAmount(resources, Resource.food) <= 0;
    }
}

