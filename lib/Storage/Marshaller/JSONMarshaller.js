/**
 * @memberOf Atlante.Storage.Marshaller
 * @implements MarshallerInterface
 */
class JSONMarshaller {
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

module.exports = JSONMarshaller;
