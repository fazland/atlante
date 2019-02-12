/**
 * @memberOf Fazland.Atlante.Storage.Marshaller
 * @implements MarshallerInterface
 */
class NullMarshaller {
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

module.exports = NullMarshaller;
