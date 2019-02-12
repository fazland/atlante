import MarshallerInterface = require("./MarshallerInterface");

declare class JSONMarshaller implements MarshallerInterface {
    /**
     * @inheritdoc
     */
    marshall(value: any): string;

    /**
     * @inheritdoc
     */
    unmarshall(value: string): any;
}

export = JSONMarshaller;
