/*-
 * ‌
 * Hedera JavaScript SDK
 * ​
 * Copyright (C) 2020 - 2023 Hedera Hashgraph, LLC
 * ​
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ‍
 */

import * as entity_id from "../EntityIdHelper.js";
import * as HashgraphProto from "@hashgraph/proto";

/**
 * @typedef {import("long")} Long
 * @typedef {import("../client/Client.js").default<*, *>} Client
 */

/**
 * The ID for a crypto-currency token on Hedera.
 */
export default class TokenId {
    /**
     * @param {number | Long | import("../EntityIdHelper").IEntityId} props
     * @param {(number | Long)=} realm
     * @param {(number | Long)=} num
     */
    constructor(props, realm, num) {
        const result = entity_id.constructor(props, realm, num);

        this.shard = result.shard;
        this.realm = result.realm;
        this.num = result.num;

        /**
         * @type {string | null}
         */
        this._checksum = null;
    }

    /**
     * @param {string} text
     * @returns {TokenId}
     */
    static fromString(text) {
        const result = entity_id.fromString(text);
        const id = new TokenId(result);
        id._checksum = result.checksum;
        return id;
    }

    /**
     * @internal
     * @param {HashgraphProto.proto.ITokenID} id
     * @returns {TokenId}
     */
    static _fromProtobuf(id) {
        const tokenId = new TokenId(
            id.shardNum != null ? id.shardNum : 0,
            id.realmNum != null ? id.realmNum : 0,
            id.tokenNum != null ? id.tokenNum : 0,
        );

        return tokenId;
    }

    /**
     * @returns {string | null}
     */
    get checksum() {
        return this._checksum;
    }

    /**
     * @deprecated - Use `validateChecksum` instead
     * @param {Client} client
     */
    validate(client) {
        console.warn("Deprecated: Use `validateChecksum` instead");
        this.validateChecksum(client);
    }

    /**
     * @param {Client} client
     */
    validateChecksum(client) {
        entity_id.validateChecksum(
            this.shard,
            this.realm,
            this.num,
            this._checksum,
            client,
        );
    }

    /**
     * @param {Uint8Array} bytes
     * @returns {TokenId}
     */
    static fromBytes(bytes) {
        return TokenId._fromProtobuf(
            HashgraphProto.proto.TokenID.decode(bytes),
        );
    }

    /**
     * @param {string} address
     * @returns {TokenId}
     */
    static fromSolidityAddress(address) {
        return new TokenId(...entity_id.fromSolidityAddress(address));
    }

    /**
     * @returns {string}
     */
    toSolidityAddress() {
        return entity_id.toSolidityAddress([this.shard, this.realm, this.num]);
    }

    /**
     * @internal
     * @returns {HashgraphProto.proto.ITokenID}
     */
    _toProtobuf() {
        return {
            tokenNum: this.num,
            shardNum: this.shard,
            realmNum: this.realm,
        };
    }

    /**
     * @returns {string}
     */
    toString() {
        return `${this.shard.toString()}.${this.realm.toString()}.${this.num.toString()}`;
    }

    /**
     * @param {Client} client
     * @returns {string}
     */
    toStringWithChecksum(client) {
        return entity_id.toStringWithChecksum(this.toString(), client);
    }

    /**
     * @returns {Uint8Array}
     */
    toBytes() {
        return HashgraphProto.proto.TokenID.encode(this._toProtobuf()).finish();
    }

    /**
     * @returns {TokenId}
     */
    clone() {
        const id = new TokenId(this);
        id._checksum = this._checksum;
        return id;
    }

    /**
     * @param {TokenId} other
     * @returns {number}
     */
    compare(other) {
        return entity_id.compare(
            [this.shard, this.realm, this.num],
            [other.shard, other.realm, other.num],
        );
    }
}
