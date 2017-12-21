composer archive create -t dir -n .

composer runtime install --card PeerAdmin@hlfv1 --businessNetworkName jobchain

composer network start --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw --archiveFile jobchain@0.0.1.bna --file networkadmin.card

composer card import --file networkadmin.card

composer network ping --card admin@jobchain

composer-rest-server -c admin@jobchain -n never