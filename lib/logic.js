/**
 * This file contains the javascript logic required to carry out transactions in our network. The transaction 
 * logic is automatically invoked by the runtime whenever the relevant transactions are submitted.
 * 
 * Reference: https://hyperledger.github.io/composer/reference/js_scripts.html 
 * 
 * @author Tyrell Perera 
 * 
 */


/**
 * Issue points to a member.
 * @param  {co.tyrell.loyalty.IssuePoints} issuePointsTransaction - the points issuing transaction
 * @transaction
 */
function issuePoints(issuePointsTransaction) {

    // Increase the member's point balance
    issuePointsTransaction.receivingCard.pointBalance += issuePointsTransaction.pointsOffer.pointsAmount;

    // Create an IssuePointsEvent
    var issuePointsEvent = getFactory().newEvent('co.tyrell.loyalty', 'IssuePointsEvent');
    issuePointsEvent.receivingCard = issuePointsTransaction.receivingCard;
    issuePointsEvent.pointsOffer = issuePointsTransaction.pointsOffer;

    // Commit changes to the network
    return getAssetRegistry('co.tyrell.loyalty.Card')
        .then(function (cardRegistry) {
            return cardRegistry.update(issuePointsTransaction.receivingCard);
        }).then(function (receivingCard) {
            // Emit the point issue event to the network.
            emit(issuePointsEvent);
        });
}

/**
 * Redeem points by a member.
 * @param  {co.tyrell.loyalty.RedeemPoints} redeemPointsTransaction - the points redemption transaction
 * @transaction
 */
function redeemPoints(redeemPointsTransaction) {

    // Reduce the amount of points from the member's card if the card has enough points to redeeem the offer.
    if (redeemPointsTransaction.redeemingCard.pointBalance >= redeemPointsTransaction.redemptionOffer.pointsAmount) {
        redeemPointsTransaction.redeemingCard.pointBalance -= redeemPointsTransaction.redemptionOffer.pointsAmount;
    } else {
        throw new Error('Insufficient points balance to redeem this offer.');
    }

    // Create a RedeemPointsEvent
    var redeemPointsEvent = getFactory().newEvent('co.tyrell.loyalty', 'RedeemPointsEvent');
    redeemPointsEvent.redeemingCard = redeemPointsTransaction.redeemingCard;
    redeemPointsEvent.redemptionOffer = redeemPointsTransaction.redemptionOffer;

    // Commit changes to the network
    return getAssetRegistry('co.tyrell.loyalty.Card')
        .then(function (cardRegistry) {
            return cardRegistry.update(redeemPointsTransaction.redeemingCard);
        }).then(function (redeemingCard) {
            // Emit the point redemption event to the network.
            emit(redeemPointsEvent);
        });
}
