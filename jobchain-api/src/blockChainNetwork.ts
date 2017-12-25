import { BusinessNetworkConnection, ParticipantRegisty as ParticipantRegistry, AssetRegistry } from "composer-client";
import { BusinessNetworkDefinition } from "composer-admin";
import * as rx from "rxjs";

class Registries {
    person: ParticipantRegistry;
    organization: ParticipantRegistry;
    workHistory: AssetRegistry;
    educationHistory: AssetRegistry;
}

class BlockChainNetwork {
    businessNetworkConnection: BusinessNetworkConnection;
    businessNetworkDefinition: BusinessNetworkDefinition;
    cardName: string = "admin@jobchain";
    networkIdentifier: string = 'jobchain@0.0.1';
    factory: any;
    registries: Registries = new Registries();

    constructor() { }

    async connect() {
        try {
            this.businessNetworkConnection = new BusinessNetworkConnection();
            this.businessNetworkDefinition = await this.businessNetworkConnection.connect(this.cardName)
            console.info("Connected to", this.businessNetworkDefinition.getName());
            this.factory = this.businessNetworkDefinition.getFactory();
            await this.initRegistries();
        }
        catch (error) {
            console.error(error);
            process.abort();
        }
    }

    private async initRegistries() {
        this.registries.person = await this.businessNetworkConnection.getParticipantRegistry("ca.jobchain.Person");
        this.registries.organization = await this.businessNetworkConnection.getParticipantRegistry("ca.jobchain.Organization");
        this.registries.workHistory = await this.businessNetworkConnection.getAssetRegistry("ca.jobchain.WorkHistory");
        this.registries.educationHistory = await this.businessNetworkConnection.getAssetRegistry("ca.jobchain.EducationHistory");
    }

}

export const blockChainNetwork = new BlockChainNetwork();