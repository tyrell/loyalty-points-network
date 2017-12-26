/**
 * @author Tyrell Perera
 * 
 */

'use strict';

const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
const IdCard = require('composer-common').IdCard;
const MemoryCardStore = require('composer-common').MemoryCardStore;
const path = require('path');

require('chai').should();

const namespace = 'co.tyrell.loyalty';

describe('Issue Points', () => {
    // In-memory card store for testing so cards are not persisted to the file system
    const cardStore = new MemoryCardStore();
    let adminConnection;
    let businessNetworkConnection;

    before(() => {
        // Embedded connection used for local testing
        const connectionProfile = {
            name: 'embedded',
            type: 'embedded'
        };
        // Embedded connection does not need real credentials
        const credentials = {
            certificate: 'FAKE CERTIFICATE',
            privateKey: 'FAKE PRIVATE KEY'
        };

        // PeerAdmin identity used with the admin connection to deploy business networks
        const deployerMetadata = {
            version: 1,
            userName: 'PeerAdmin',
            roles: [ 'PeerAdmin', 'ChannelAdmin' ]
        };
        const deployerCard = new IdCard(deployerMetadata, connectionProfile);
        deployerCard.setCredentials(credentials);

        const deployerCardName = 'PeerAdmin';
        adminConnection = new AdminConnection({ cardStore: cardStore });

        return adminConnection.importCard(deployerCardName, deployerCard).then(() => {
            return adminConnection.connect(deployerCardName);
        });
    });

    beforeEach(() => {
        businessNetworkConnection = new BusinessNetworkConnection({ cardStore: cardStore });

        const adminUserName = 'admin';
        let adminCardName;
        let businessNetworkDefinition;

        return BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..')).then(definition => {
            businessNetworkDefinition = definition;
            // Install the Composer runtime for the new business network
            return adminConnection.install(businessNetworkDefinition.getName());
        }).then(() => {
            // Start the business network and configure an network admin identity
            const startOptions = {
                networkAdmins: [
                    {
                        userName: adminUserName,
                        enrollmentSecret: 'adminpw'
                    }
                ]
            };
            return adminConnection.start(businessNetworkDefinition, startOptions);
        }).then(adminCards => {
            // Import the network admin identity for us to use
            adminCardName = `${adminUserName}@${businessNetworkDefinition.getName()}`;
            return adminConnection.importCard(adminCardName, adminCards.get(adminUserName));
        }).then(() => {
            // Connect to the business network using the network admin identity
            return businessNetworkConnection.connect(adminCardName);
        });
    });

    describe('#issue', () => {

        it('should be able to issue points', () => {

            const factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            // create a Member
            const member = factory.newResource(namespace, 'Member', 'life@mars.com');
            member.firstName = 'John';
            member.lastName = 'Doe';
            member.dateOfBirth = '01-11-1975';

            // Create a Card
            const card = factory.newResource(namespace, 'Card', '8623');
            card.pointBalance = 0;
            card.owner = factory.newRelationship(namespace, 'Member', member.email);

            // create a Partner
            const partner = factory.newResource(namespace, 'Partner', '4514');
            partner.partnerName = 'Coles Supermarket'

            // create a Partner Offer
            const offer = factory.newResource(namespace, 'Offer', '3832');
            offer.pointsAmount = 1;
            offer.partner = factory.newRelationship(namespace, 'Partner', partner.partnerId);

            // create the point issue transaction
            const issuePoints = factory.newTransaction(namespace, 'IssuePoints');
            issuePoints.pointsOffer = factory.newRelationship(namespace, 'Offer', offer.offerId);
            issuePoints.receivingCard = factory.newRelationship(namespace, 'Card', card.cardNumber);

            return businessNetworkConnection.getParticipantRegistry(namespace + '.Member')
            .then((memberRegistry) => {
                // add the member
                return memberRegistry.addAll([member]);
            })
            .then(() => {
                return businessNetworkConnection.getAssetRegistry(namespace + '.Card')
            })
            .then((cardRegistry) => {
                // add the card
                return cardRegistry.addAll([card]);
            })
            .then(() => {
                return businessNetworkConnection.getParticipantRegistry(namespace + '.Partner')
            })
            .then((partnerRegistry) => {
                // add the partner
                return partnerRegistry.addAll([partner]);
            })
            .then(() => {
                return businessNetworkConnection.getAssetRegistry(namespace + '.Offer');
            })
            .then((offerRegistry) => {
                // add offer
                return offerRegistry.addAll([offer]);
            })
            .then(() => {
                // submit the issuePoints transaction
                return businessNetworkConnection.submitTransaction(issuePoints);
            })
            .then(() => {
                return businessNetworkConnection.getAssetRegistry(namespace + '.Card');
            })
            .then((cardegistry) => {
                // get the card and check its points balance
                return cardegistry.get(card.cardNumber);
            })
            .then((updatedCardAsset) => {
                updatedCardAsset.pointBalance.should.equal(card.pointBalance + offer.pointsAmount);
            });
        });
    });
});
