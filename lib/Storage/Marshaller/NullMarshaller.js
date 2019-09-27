/**
 * @memberOf Fazland.Atlante.Storage.Marshaller
 * @implements MarshallerInterface
 */
export default class NullMarshaller {
    /**
     * @inheritdoc
     */
    marshall(value) {
        return value.toString();
    }

    /**
     * @inheritdoc
     */
    unmarshall(value) {
        return value;
    }
}
