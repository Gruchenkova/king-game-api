import {Request, Response} from 'express';
import {Controller, Param, Body, Get, Post, Put, Delete, Req, Res} from 'routing-controllers';
import 'reflect-metadata';
import {GameManager} from './service/gameManager';
import {ResourceAmount} from "./model/resource";
import {Human} from "./model/human";
import {getAllBuildings} from './service/buildingService';

export const gameManager = new GameManager();

class Stats {
    population: {};
    resources: ResourceAmount[]
}

@Controller()
export class GameController {
    @Get('/state')
    getAll(@Req() request: Request, @Res() response: Response) {
        const stats = new Stats();
        stats.population = gameManager.getAllPeople().reduce((total, value) => {
            total[value.type] = (total[value.type] || 0) + 1;
            return total;
        }, {});
        stats.resources = gameManager.getAllResourse();

        return stats;
    }

    @Get('/buildings')
    getAllBuildings() {
        const buildings = getAllBuildings();
        return buildings;
    }

    @Get('/availableBuildings')
    getAllBuildingsToBuild() {
        const buildings = gameManager.getAvailableBuildings();
        return buildings;
    }

   @Put('/building/:name')
    buyBuilding(@Param('name') name: string) {
      gameManager.build(name);
    }
}