// SPDX-License-Identifier: Apache-2.0

import Long from "long";
import TokenId from "../token/TokenId.js";
import AccountId from "../account/AccountId.js";
import ObjectMap from "../ObjectMap.js";

/**
 * @namespace proto
 * @typedef {import("@hashgraph/proto").proto.ITokenTransferList} HashgraphProto.proto.ITokenTransferList
 * @typedef {import("@hashgraph/proto").proto.INftTransfer} HashgraphProto.proto.INftTransfer
 * @typedef {import("@hashgraph/proto").proto.IAccountAmount} HashgraphProto.proto.IAccountAmount
 * @typedef {import("@hashgraph/proto").proto.ITokenID} HashgraphProto.proto.ITokenID
 * @typedef {import("@hashgraph/proto").proto.IAccountID} HashgraphProto.proto.IAccountID
 */

/**
 * @typedef {object} NftTransfer
 * @property {AccountId} sender
 * @property {AccountId} recipient
 * @property {Long} serial
 * @property {boolean} isApproved
 */

/**
 * @augments {ObjectMap<TokenId, NftTransfer[]>}
 */
export default class TokenNftTransferMap extends ObjectMap {
    constructor() {
        super((s) => TokenId.fromString(s));
    }

    /**
     * @internal
     * @param {TokenId} tokenId
     * @param {NftTransfer} nftTransfer
     */
    __set(tokenId, nftTransfer) {
        const token = tokenId.toString();

        let _map = this._map.get(token);
        if (_map == null) {
            _map = [];
            this._map.set(token, _map);
            this.__map.set(tokenId, _map);
        }

        _map.push(nftTransfer);
    }

    /**
     * @param {HashgraphProto.proto.ITokenTransferList[]} transfers
     * @returns {TokenNftTransferMap}
     */
    static _fromProtobuf(transfers) {
        const tokenTransfersMap = new TokenNftTransferMap();

        for (const transfer of transfers) {
            const token = TokenId._fromProtobuf(
                /** @type {HashgraphProto.proto.ITokenID} */ (transfer.token),
            );

            for (const aa of transfer.nftTransfers != null
                ? transfer.nftTransfers
                : []) {
                const sender = AccountId._fromProtobuf(
                    /** @type {HashgraphProto.proto.IAccountID} */ (
                        aa.senderAccountID
                    ),
                );
                const recipient = AccountId._fromProtobuf(
                    /** @type {HashgraphProto.proto.IAccountID} */ (
                        aa.receiverAccountID
                    ),
                );

                tokenTransfersMap.__set(token, {
                    sender,
                    recipient,
                    serial: Long.fromValue(
                        /** @type {Long} */ (aa.serialNumber),
                    ),
                    isApproved: false,
                });
            }
        }

        return tokenTransfersMap;
    }

    /**
     * @returns {HashgraphProto.proto.ITokenTransferList[]}
     */
    _toProtobuf() {
        /** @type {HashgraphProto.proto.ITokenTransferList[]} */
        const tokenTransferList = [];

        for (const [tokenId, value] of this) {
            /** @type {HashgraphProto.proto.INftTransfer[]} */
            const transfers = [];

            for (const transfer of value) {
                transfers.push({
                    senderAccountID: transfer.sender._toProtobuf(),
                    receiverAccountID: transfer.recipient._toProtobuf(),
                    serialNumber: transfer.serial,
                });
            }

            tokenTransferList.push({
                token: tokenId._toProtobuf(),
                nftTransfers: transfers,
            });
        }

        return tokenTransferList;
    }

    toJSON() {
        const obj = {};

        this._map.forEach((value, key) => {
            // @ts-ignore
            obj[key] = value.map((nftTransfer) => ({
                sender: nftTransfer.sender.toString(),
                recipient: nftTransfer.recipient.toString(),
                serial: nftTransfer.serial,
                isApproved: nftTransfer.isApproved,
            }));
        });

        return obj;
    }
}
