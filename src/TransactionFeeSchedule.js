// SPDX-License-Identifier: Apache-2.0

import * as HashgraphProto from "@hashgraph/proto";
import RequestType from "./RequestType.js";
import FeeData from "./FeeData.js";

export default class TransactionFeeSchedule {
    /**
     * @param {object} [props]
     * @param {RequestType} [props.hederaFunctionality]
     * @param {FeeData} [props.feeData]
     * @param {FeeData[]} [props.fees]
     */
    constructor(props = {}) {
        /*
         * A particular transaction or query
         *
         * @type {RequestType}
         */
        this.hederaFunctionality = props.hederaFunctionality;

        /*
         * Resource price coefficients
         *
         * @type {FeeData}
         */
        this.feeData = props.feeData;

        /*
         * Resource price coefficients
         *
         * @type {FeeData[]}
         */
        this.fees = props.fees;
    }

    /**
     * @param {Uint8Array} bytes
     * @returns {TransactionFeeSchedule}
     */
    static fromBytes(bytes) {
        return TransactionFeeSchedule._fromProtobuf(
            HashgraphProto.proto.TransactionFeeSchedule.decode(bytes),
        );
    }

    /**
     * @internal
     * @param {HashgraphProto.proto.ITransactionFeeSchedule} transactionFeeSchedule
     * @returns {TransactionFeeSchedule}
     */
    static _fromProtobuf(transactionFeeSchedule) {
        return new TransactionFeeSchedule({
            hederaFunctionality:
                transactionFeeSchedule.hederaFunctionality != null
                    ? RequestType._fromCode(
                          transactionFeeSchedule.hederaFunctionality,
                      )
                    : undefined,
            feeData:
                transactionFeeSchedule.feeData != null
                    ? FeeData._fromProtobuf(transactionFeeSchedule.feeData)
                    : undefined,
            fees:
                transactionFeeSchedule.fees != null
                    ? transactionFeeSchedule.fees.map((fee) =>
                          FeeData._fromProtobuf(fee),
                      )
                    : undefined,
        });
    }

    /**
     * @internal
     * @returns {HashgraphProto.proto.ITransactionFeeSchedule}
     */
    _toProtobuf() {
        return {
            hederaFunctionality:
                this.hederaFunctionality != null
                    ? this.hederaFunctionality.valueOf()
                    : undefined,
            feeData:
                this.feeData != null ? this.feeData._toProtobuf() : undefined,
            fees:
                this.fees != null
                    ? this.fees.map((fee) => fee._toProtobuf())
                    : undefined,
        };
    }

    /**
     * @returns {Uint8Array}
     */
    toBytes() {
        return HashgraphProto.proto.TransactionFeeSchedule.encode(
            this._toProtobuf(),
        ).finish();
    }
}
