import { EntityStore } from '@apollo/client/cache';
import { Entity, Metadata, MetadataCollection, Relation } from 'coghent-vue-3-component-library/lib/queries';

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
  setMetadataToOneRelationDown: (_entity: NestedDataObject, _label: string) => NestedDataObject
  filterOutDuplicateCollections: (_entity: NestedDataObject) => NestedDataObject
  getParentCollectionByName: (_entity: NestedDataObject, _label: string) => Metadata | undefined
} => {

  const getParentCollectionByName = (_entity: NestedDataObject, _label: string) => {
    let collection = {} as Metadata | undefined
    const entity = JSON.parse(JSON.stringify(_entity)) as NestedDataObject
    if (entity.metadataCollection) {
      const filtered = entity.metadataCollection.filter(_collection => _collection.label == _label)
      if (filtered && filtered.length != 0) {
        console.log({ filtered })
        if (filtered.length == 1) {
          filtered[0].data?.forEach(_data => {
            if (_data?.nestedMetaData?.title.length != 0) {
              collection = _data as Metadata
            }
          })
        }
      }else collection = undefined
    }
    return collection
  }

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

  const getFirstMetadataCollectionData = (_metadataCollection: MetadataCollection) => {
    if (_metadataCollection && _metadataCollection.nested && _metadataCollection.data?.[0]) {
      const _metadataCollectionFirstLevel = _metadataCollection.data[0].nestedMetaData?.metadataCollection
      return _metadataCollectionFirstLevel
    } else return null
  }

  const getFirstMetadataCollectionLabel = (_metadataCollection: MetadataCollection) => {
    if (_metadataCollection && _metadataCollection.nested && _metadataCollection.data?.[0]) {
      return _metadataCollection.data[0].value as string
    } else return ''
  }

  const setMetadataToOneRelationDown = (_entity: NestedDataObject, _label: string) => {
    const entity = JSON.parse(JSON.stringify(_entity)) as NestedDataObject
    const filtered = entity.metadataCollection.filter((_collectie) => _collectie.label == _label)[0]
    const firstLevel = getFirstMetadataCollectionData(filtered)
    if (firstLevel && firstLevel[0]) {
      const itemIs = entity.metadataCollection[entity.metadataCollection.indexOf(filtered)]
      itemIs.label = getFirstMetadataCollectionLabel(firstLevel[0])
      if (itemIs.data && itemIs.data[0] && itemIs.data[0].nestedMetaData) {
        itemIs.data[0].nestedMetaData.metadataCollection = getFirstMetadataCollectionData(firstLevel[0] as MetadataCollection) as Array<MetadataCollection>
        entity.metadataCollection[entity.metadataCollection.indexOf(filtered)] = itemIs
      }
    }
    return entity
  }

  //TODO:
  const filterOutDuplicateCollections = (_entity: NestedDataObject) => {
    const entity = JSON.parse(JSON.stringify(_entity)) as NestedDataObject
    const parentLabels = entity.metadataCollection.map(_collection => _collection.label)
    for (const _collection of entity.metadataCollection) {
      if (_collection.nested && _collection.data) {
        for (const _data of _collection.data) {
          if (_data?.nestedMetaData?.metadataCollection?.length != 0) {
            const filteredMetadata = _data?.nestedMetaData?.metadataCollection?.filter(_metadata => parentLabels.includes(_metadata?.label as string))
            if (filteredMetadata && filteredMetadata.length != 0) {
              for (const _filtered of filteredMetadata) {
                removeParentCollections(entity.metadataCollection, [_filtered?.label as string])
              }
            }
          }
        }
      }
    }
    return entity
  }

  return {
    removeChildByLabel,
    removeParentCollections,
    removeParentsWithoutMetadata,
    removeParentsWithoutData,
    setMetadataToOneRelationDown,
    filterOutDuplicateCollections,
    getParentCollectionByName,
  }
};

export default useFilter;