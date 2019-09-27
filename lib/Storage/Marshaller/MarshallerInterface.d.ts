declare interface MarshallerInterface {
    /**
     * Serializes a value into a string.
     */
    marshall(value: any): string;

    /**
     * Converts a serialized value into its original representation.
     */
    unmarshall(value: string): any;
}

export default MarshallerInterface;
