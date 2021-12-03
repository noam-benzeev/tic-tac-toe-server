import { Game } from "../../models/interfaces/game";

export class GameController {
    static createGame(newGame: Game): boolean {
        let succeed: boolean = false;
        try {
            succeed = true;
        } catch (error: any) {

        }
        return succeed;
    }
}