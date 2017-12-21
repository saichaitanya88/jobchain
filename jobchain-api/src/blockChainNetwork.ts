import { BusinessNetworkConnection } from "composer-client";
import { BusinessNetworkDefinition } from "composer-admin";
import * as rx from "rxjs";

class BlockChainNetwork {
    businessNetworkConnection: BusinessNetworkConnection;
    businessNetworkDefinition: BusinessNetworkDefinition;
    cardName: string = "admin@jobchain";
    networkIdentifier: string = 'jobchain@0.0.1';
    factory: any;

    constructor() {
        
    }

    connect(): rx.Observable<boolean> {
        return rx.Observable.create(obs => {
            this.businessNetworkConnection = new BusinessNetworkConnection();
            this.businessNetworkConnection.connect(this.cardName)
                .then((result) => {
                    this.businessNetworkDefinition = result;
                    console.info("Connected to", this.businessNetworkDefinition.getName());
                    this.factory = this.businessNetworkDefinition.getFactory();
                    obs.next(true);
                    obs.complete();
                }).catch(error => {
                    console.error(error);
                    process.abort();
                });
        });
    }
}

export const blockChainNetwork = new BlockChainNetwork();