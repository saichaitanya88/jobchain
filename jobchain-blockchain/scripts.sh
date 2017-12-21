# ./startFabric.sh

composer archive create -t dir -n .

composer runtime install --card PeerAdmin@hlfv1 --businessNetworkName jobchain

composer network start --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw --archiveFile jobchain@0.0.1.bna --file networkadmin.card

composer card import --file networkadmin.card

composer network ping --card admin@jobchain

## composer-rest-server -c admin@jobchain -n never

# create models for typescript
# composer generator create -a jobchain@0.0.1.bna -f Typescript --outputDir models/ts

# upgrade bna to re-deploy to fabric
# composer network upgrade -n <business-network-archive> -p <connection-profile-Name> -i <upgrade-Id> -s <upgrade-Secret>