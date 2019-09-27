import MarshallerInterface from './MarshallerInterface';

declare class NullMarshaller implements MarshallerInterface {
    /**
     * @inheritdoc
     */
    marshall(value: any): string;

    /**
     * @inheritdoc
     */
    unmarshall(value: string): any;
}

export default NullMarshaller;
