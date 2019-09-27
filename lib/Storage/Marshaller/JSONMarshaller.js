/**
 * @memberOf Fazland.Atlante.Storage.Marshaller
 *
 * @implements MarshallerInterface
 */
export default class JSONMarshaller {
    /**
     * @inheritdoc
     */
    marshall(value) {
        return JSON.stringify(value);
    }

    /**
     * @inheritdoc
     */
    unmarshall(value) {
        return JSON.parse(value);
    }
}
