import { MetadataCollection, Relation } from 'coghent-vue-3-component-library/lib/queries';

export type NestedDataObject = {
  description: []
  id: string
  mediafiles: []
  metadataCollection: Array<MetadataCollection>
  objectNumber: []
  relations: Array<Relation>
  title: []
  type: string
  types: Array<TypeObject>
  __typename: string
}

type TypeObject = {
  label: string
  id: string
  relation: string
}

const useFilter = (): {
  removeChildByLabel: (_entity: NestedDataObject, _parentCollection: string, _label: string) => NestedDataObject;
} => {
  const removeChildByLabel = (_entity: NestedDataObject, _parentCollection: string, _label: string) => {
    const entityCopy = {} as NestedDataObject;
    Object.assign(entityCopy, _entity);
    const item = entityCopy.metadataCollection.filter(_collection => _collection.label == _parentCollection);
    if (item && item[0] && item[0].nested) {
      const itemToDelete = item[0].data?.[0]?.nestedMetaData?.metadataCollection?.filter(_collection => _collection?.label == _label)
      if (itemToDelete && itemToDelete[0]) {
        item[0].data?.[0]?.nestedMetaData?.metadataCollection?.splice(item[0].data?.[0]?.nestedMetaData?.metadataCollection?.indexOf(itemToDelete[0]), 1);
      }

    }
    return entityCopy
  };

  return { removeChildByLabel }
};

export default useFilter;