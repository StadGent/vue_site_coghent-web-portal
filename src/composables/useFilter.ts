import { EntityStore } from '@apollo/client/cache';
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
  removeChildByLabel: (_entity: NestedDataObject, _parentCollectionLabel: string, _label: string) => NestedDataObject;
  removeParentCollections: (_metadataCollection: Array<MetadataCollection>, _parentLabels: Array<string>) => Array<MetadataCollection>
  removeParentsWithoutMetadata: (_entity: NestedDataObject) => NestedDataObject
  removeParentsWithoutData: (_entity: NestedDataObject) => NestedDataObject
} => {

  const removeChildByLabel = (_entity: NestedDataObject, _parentCollectionLabel: string, _label: string) => {
    const entity = JSON.parse(JSON.stringify(_entity)) as NestedDataObject
    if (entity.metadataCollection) {
      const matchingWithParentLabel = entity.metadataCollection.filter(_parentCollection => _parentCollection.label == _parentCollectionLabel)
      for (const _parentMatch of matchingWithParentLabel) {
        if (_parentMatch.nested && _parentMatch.data) {
          for (const _data of _parentMatch.data) {
            const matchingWithLabel = _data?.nestedMetaData?.metadataCollection?.filter(_meta => _meta?.label == _label)
            if (matchingWithLabel) {
              for (const _childMatch of matchingWithLabel) {
                const index = _data?.nestedMetaData?.metadataCollection?.indexOf(_childMatch)
                _data?.nestedMetaData?.metadataCollection?.splice(index as number, 1)
                if (_data?.nestedMetaData?.metadataCollection?.length == 0) {
                  const index = _parentMatch.data.indexOf(_data);
                  _parentMatch.data.splice(index, 1)
                }
              }
            }
          }
        }
      }
    }
    return entity
  };

  const removeParentCollections = (_metadataCollection: Array<MetadataCollection>, _parentLabels: Array<string>) => {
    const myMetadata: Array<MetadataCollection> = []
    Object.assign(myMetadata, _metadataCollection)
    return myMetadata.filter((_collection) => !_parentLabels.includes(_collection.label))
  }

  const removeParentsWithoutData = (_entity: NestedDataObject) => {
    const entity = JSON.parse(JSON.stringify(_entity)) as NestedDataObject
    if (entity.metadataCollection) {
      for (const _collection of entity.metadataCollection) {
        if (_collection.data && _collection.data.length == 0) {
          const index = entity.metadataCollection.indexOf(_collection);
          entity.metadataCollection.splice(index, 1)
        }
      }
    }
    return entity
  }

  const removeParentsWithoutMetadata = (_entity: NestedDataObject) => {
    let entity = JSON.parse(JSON.stringify(_entity)) as NestedDataObject
    if (entity.metadataCollection) {
      for (const _parentCollection of entity.metadataCollection) {
        if (_parentCollection.nested && _parentCollection.data) {
          for (const _data of _parentCollection.data) {
            if (_data?.nestedMetaData?.metadataCollection && _data?.nestedMetaData?.metadataCollection.length == 0) {
              const index = _parentCollection.data.indexOf(_data)
              _parentCollection.data.splice(index, 1)
                          
            }
          }
        }
      }
    }
    entity = removeParentsWithoutData(entity)
    return entity
  }

  return {
    removeChildByLabel,
    removeParentCollections,
    removeParentsWithoutMetadata,
    removeParentsWithoutData
  }
};

export default useFilter;