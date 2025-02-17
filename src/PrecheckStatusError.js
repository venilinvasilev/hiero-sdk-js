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

import StatusError from "./StatusError.js";

/**
 * @typedef {import("./Status.js").default} Status
 * @typedef {import("./transaction/TransactionId.js").default} TransactionId
 * @typedef {import("./contract/ContractFunctionResult.js").default} ContractFunctionResult
 * @typedef {import("./account/AccountId.js").default} AccountId
 */

/**
 * @typedef {object} PrecheckStatusErrorJSON
 * @property {string} name
 * @property {string} status
 * @property {string} transactionId
 * @property {?string | null} nodeId
 * @property {string} message
 * @property {?ContractFunctionResult} contractFunctionResult
 */

/**
 * Represents an error that occurs during the pre-check phase of a transaction
 * on the Hedera network. The `PrecheckStatusError` class extends the base
 * `StatusError` class and provides additional context specific to pre-check
 * failures, such as the transaction ID, status, and any associated messages.
 *
 * This error is typically thrown when a transaction fails to meet the necessary
 * conditions before being processed, allowing developers to handle such errors
 * gracefully in their applications. The error includes details about the failure,
 * making it easier to diagnose issues related to transaction submissions.
 */
export default class PrecheckStatusError extends StatusError {
    /**
     * @param {object} props
     * @param {Status} props.status
     * @param {TransactionId} props.transactionId
     * @param {AccountId} props.nodeId
     * @param {?ContractFunctionResult} props.contractFunctionResult
     */
    constructor(props) {
        super(
            props,
            `transaction ${props.transactionId.toString()} failed precheck with status ${props.status.toString()} against node account id ${props.nodeId.toString()}`,
        );

        /**
         * @type {?ContractFunctionResult}
         * @readonly
         */
        this.contractFunctionResult = props.contractFunctionResult;

        /**
         * @type {AccountId}
         * @readonly
         */
        this.nodeId = props.nodeId;
    }

    /**
     * @returns {PrecheckStatusErrorJSON}
     */
    toJSON() {
        return {
            name: this.name,
            status: this.status.toString(),
            transactionId: this.transactionId.toString(),
            nodeId: this.nodeId.toString(),
            message: this.message,
            contractFunctionResult: this.contractFunctionResult,
        };
    }
}
