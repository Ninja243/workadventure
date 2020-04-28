import {MessageUserPosition} from "./Websocket/MessageUserPosition";
import { World } from "./World";
import { UserInterface } from "./UserInterface";

export class Group {
    static readonly MAX_PER_GROUP = 4;

    private users: UserInterface[];
    private connectCallback: (user1: string, user2: string) => void;
    private disconnectCallback: (user1: string, user2: string) => void;


    constructor(users: UserInterface[], connectCallback: (user1: string, user2: string) => void, disconnectCallback: (user1: string, user2: string) => void) {
        this.users = [];
        this.connectCallback = connectCallback;
        this.disconnectCallback = disconnectCallback;

        users.forEach((user: UserInterface) => {
            this.join(user);
        });
    }

    getUsers(): UserInterface[] {
        return this.users;
    }

    isFull(): boolean {
        return this.users.length >= Group.MAX_PER_GROUP;
    }

    join(user: UserInterface): void
    {
        // Broadcast on the right event
        this.users.forEach((groupUser: UserInterface) => {
            this.connectCallback(user.id, groupUser.id);
        });
        this.users.push(user);
        user.group = this;
    }

    isPartOfGroup(user: UserInterface): boolean
    {
        return this.users.indexOf(user) !== -1;
    }

    isStillIn(user: UserInterface): boolean
    {
        if(!this.isPartOfGroup(user)) {
            return false;
        }
        let stillIn = true;
        for(let i = 0; i <= this.users.length; i++) {
            let userInGroup = this.users[i];
            let distance = World.computeDistance(user, userInGroup);
            if(distance > World.MIN_DISTANCE) {
                stillIn = false;
                break;
            }
        }
        return stillIn;
    }

    removeFromGroup(users: UserInterface[]): void
    {
        for(let i = 0; i < users.length; i++){
            let user = users[i];
            const index = this.users.indexOf(user, 0);
            if (index > -1) {
                this.users.splice(index, 1);
            }
        }
    }
}