echo 'generating bna'
composer archive create -t dir -n .
echo 'Done!'
echo 'generating models from bna'
composer generator create -a jobchain@0.0.1.bna -f Typescript --outputDir models/ts
echo 'Done!'
echo 'copying models to angular project'
cp ./models/ts/ca.jobchain.ts ../jobchain-ui/src/app/models/ca.jobchain.ts
cp ./models/ts/index.ts ../jobchain-ui/src/app/models/index.ts
cp ./models/ts/org.hyperledger.composer.system.ts ../jobchain-ui/src/app/models/org.hyperledger.composer.system.ts
echo 'Done!'
echo 'copying models to api project'
cp ./models/ts/ca.jobchain.ts ../jobchain-api/src/models/ca.jobchain.ts
cp ./models/ts/index.ts ../jobchain-api/src/models/index.ts
cp ./models/ts/org.hyperledger.composer.system.ts ../jobchain-api/src/models/org.hyperledger.composer.system.ts
echo 'Done!'