import { Metadata, MetadataCollection, Relation } from 'coghent-vue-3-component-library'

export type NestedDataObject = {
  description: []
  id: string
  mediafiles: []
  metadataCollection: Array<typeof MetadataCollection>
  objectNumber: []
  relations: Array<typeof Relation>
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
  removeMetadataCollectionFromNestedMetadata: (_entity: NestedDataObject, _parentLabel: string) => NestedDataObject
  getRelation: (_entity: NestedDataObject, _label: string, _value: string) => typeof Relation | undefined
  removeChildByLabel: (_entity: NestedDataObject, _parentCollectionLabel: string, _label: string) => NestedDataObject
  removeParentCollections: (_metadataCollection: Array<typeof MetadataCollection>, _parentLabels: Array<string>) => Array<typeof MetadataCollection>
  removeParentsWithoutMetadata: (_entity: NestedDataObject) => NestedDataObject
  removeParentsWithoutData: (_entity: NestedDataObject) => NestedDataObject
  removeMetadataCollectionByLabel: (_entity: NestedDataObject, metadataCollectionLabels: string[]) => NestedDataObject | any[]
  setMetadataToOneRelationDown: (_entity: NestedDataObject, _label: string) => NestedDataObject
  filterOutDuplicateCollections: (_entity: NestedDataObject) => NestedDataObject
  getParentCollectionByNameIfTitle: (_entity: NestedDataObject, _label: string) => typeof Metadata | undefined
  getParentCollectionByName: (_entity: NestedDataObject, _label: string) => typeof MetadataCollection | undefined
  getDataOfCollection: (_entity: NestedDataObject, _parentLabel: string) => Array<typeof MetadataCollection>
  getObjectNames: (_objectnameData: Array<typeof Metadata>) => Array<string>
  getMetadataCollectionByLabel: (_metadataCollections: Array<typeof MetadataCollection>, _label: string) => Array<typeof Metadata>
} => {
  const removeMetadataCollectionFromNestedMetadata = (_entity: NestedDataObject, _parentLabel: string) => {
    const entity = JSON.parse(JSON.stringify(_entity)) as NestedDataObject
    const metadata = useFilter().getMetadataCollectionByLabel(entity.metadataCollection, _parentLabel)
    if (metadata.length > 0) {
      for (const _meta of metadata) {
        if (_meta.nestedMetaData) {
          _meta.nestedMetaData.metadataCollection = []
        }
      }
      const matches = entity.metadataCollection.filter((_collection) => _collection.label == _parentLabel)
      if (matches.length == 0) {
        matches[0].data = metadata
      }
    }
    return entity
  }

  const getRelation = (_entity: NestedDataObject, _label: string, _value: string) => {
    for (const relation of _entity.relations) {
      if (relation.label == _label && relation.value == _value) {
        return relation
      } else null
    }
  }

  const getObjectNames = (_objectnameData: Array<typeof Metadata>) => {
    const objectNames: Array<string> = []
    for (const _meta of _objectnameData) {
      if (_meta.value) {
        objectNames.push(_meta.value)
      }
    }
    return objectNames
  }

  const getDataOfCollection = (_entity: NestedDataObject, _parentLabel: string) => {
    const objectNaamData: Array<typeof MetadataCollection> = []
    const collection = getParentCollectionByName(_entity, _parentLabel)
    if (collection && collection.nested && collection.data && collection.data.length != 0) {
      for (const _data of collection.data) {
        if (_data && _data?.nestedMetaData && _data?.nestedMetaData.metadataCollection && _data?.nestedMetaData.metadataCollection?.length != 0) {
          for (const _meta of _data?.nestedMetaData.metadataCollection) {
            objectNaamData.push(_meta as typeof MetadataCollection)
          }
        }
      }
    }
    return objectNaamData
  }

  const getMetadataCollectionByLabel = (_metadataCollections: Array<typeof MetadataCollection>, _label: string) => {
    const metadataForLabel: Array<typeof Metadata> = []
    if (_metadataCollections.length != 0) {
      for (const _collection of _metadataCollections) {
        if (_collection.nested && _collection.nested && _collection.data && _collection.data.length != 0) {
          for (const _data of _collection.data) {
            if (_data?.label == _label) {
              metadataForLabel.push(_data)
            }
          }
        }
      }
    }
    return metadataForLabel
  }

  const getParentCollectionByName = (_entity: NestedDataObject, _label: string) => {
    let collection = {} as typeof MetadataCollection | undefined
    const entity = JSON.parse(JSON.stringify(_entity)) as NestedDataObject
    if (entity.metadataCollection) {
      const filtered = entity.metadataCollection.filter((_collection) => _collection.label == _label)
      if (filtered && filtered.length != 0) {
        if (filtered.length == 1) {
          collection = filtered[0]
        }
      } else collection = undefined
    }
    return collection
  }

  const getParentCollectionByNameIfTitle = (_entity: NestedDataObject, _label: string) => {
    let collection = {} as typeof Metadata | undefined
    const entity = JSON.parse(JSON.stringify(_entity)) as NestedDataObject
    if (entity.metadataCollection) {
      const filtered = entity.metadataCollection.filter((_collection) => _collection.label == _label)
      if (filtered && filtered.length != 0) {
        if (filtered.length == 1) {
          filtered[0].data?.forEach((_data: any) => {
            if (_data?.nestedMetaData?.title.length != 0) {
              collection = _data as typeof Metadata
            }
          })
        }
      } else collection = undefined
    }
    return collection
  }

  const removeChildByLabel = (_entity: NestedDataObject, _parentCollectionLabel: string, _label: string) => {
    const entity = JSON.parse(JSON.stringify(_entity)) as NestedDataObject
    if (entity.metadataCollection) {
      const matchingWithParentLabel = entity.metadataCollection.filter((_parentCollection) => _parentCollection.label == _parentCollectionLabel)
      for (const _parentMatch of matchingWithParentLabel) {
        if (_parentMatch.nested && _parentMatch.data) {
          for (const _data of _parentMatch.data) {
            const matchingWithLabel = _data?.nestedMetaData?.metadataCollection?.filter((_meta: any) => _meta?.label == _label)
            if (matchingWithLabel) {
              for (const _childMatch of matchingWithLabel) {
                const index = _data?.nestedMetaData?.metadataCollection?.indexOf(_childMatch)
                _data?.nestedMetaData?.metadataCollection?.splice(index as number, 1)
                if (_data?.nestedMetaData?.metadataCollection?.length == 0) {
                  const index = _parentMatch.data.indexOf(_data)
                  _parentMatch.data.splice(index, 1)
                }
              }
            }
          }
        }
      }
    }
    return entity
  }

  const removeParentCollections = (_metadataCollection: Array<typeof MetadataCollection>, _parentLabels: Array<string>) => {
    const myMetadata: Array<typeof MetadataCollection> = []
    Object.assign(myMetadata, _metadataCollection)
    return myMetadata.filter((_collection) => !_parentLabels.includes(_collection.label))
  }

  const removeParentsWithoutData = (_entity: NestedDataObject) => {
    const entity = JSON.parse(JSON.stringify(_entity)) as NestedDataObject
    if (entity.metadataCollection) {
      for (const _collection of entity.metadataCollection) {
        if (_collection.data && _collection.data.length == 0) {
          const index = entity.metadataCollection.indexOf(_collection)
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

  const getFirstMetadataCollectionData = (_metadataCollection: typeof MetadataCollection) => {
    if (_metadataCollection && _metadataCollection.nested && _metadataCollection.data?.[0]) {
      const _metadataCollectionFirstLevel = _metadataCollection.data[0].nestedMetaData?.metadataCollection
      return _metadataCollectionFirstLevel
    } else return null
  }

  const getFirstMetadataCollectionLabel = (_metadataCollection: typeof MetadataCollection): string => {
    if (_metadataCollection && _metadataCollection.nested && _metadataCollection.data?.[0]) {
      return _metadataCollection.data[0].value as string
    } else return ''
  }

  const setMetadataToOneRelationDown = (_entity: NestedDataObject, _label: string) => {
    const entity = JSON.parse(JSON.stringify(_entity)) as NestedDataObject
    const filtered = entity.metadataCollection.filter((_collectie) => _collectie.label == _label)[0]
    if (filtered) {
      const firstLevel = getFirstMetadataCollectionData(filtered)
      const item = entity.metadataCollection.filter((element) => element.label == filtered.label)[0]
      if (firstLevel && firstLevel[0]) {
        item.data = firstLevel[0].data
      }
    }
    return entity
  }

  const filterOutDuplicateCollections = (_entity: NestedDataObject) => {
    const entity = JSON.parse(JSON.stringify(_entity)) as NestedDataObject
    const parentLabels = entity.metadataCollection.map((_collection) => _collection.label)
    for (const _collection of entity.metadataCollection) {
      if (_collection.nested && _collection.data) {
        for (const _data of _collection.data) {
          if (_data?.nestedMetaData?.metadataCollection?.length != 0) {
            const filteredMetadata = _data?.nestedMetaData?.metadataCollection?.filter((_metadata: any) => parentLabels.includes(_metadata?.label as string))
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

  const removeMetadataCollectionByLabel = (_entity: NestedDataObject, metadataCollectionLabels: string[]) => {
    _entity.metadataCollection = _entity.metadataCollection.filter((collection: typeof MetadataCollection) => !metadataCollectionLabels.includes(collection.label))
    return _entity
  }

  return {
    removeMetadataCollectionFromNestedMetadata,
    getRelation,
    getMetadataCollectionByLabel,
    getObjectNames,
    getDataOfCollection,
    removeChildByLabel,
    removeParentCollections,
    removeParentsWithoutMetadata,
    removeParentsWithoutData,
    setMetadataToOneRelationDown,
    filterOutDuplicateCollections,
    getParentCollectionByNameIfTitle,
    getParentCollectionByName,
    removeMetadataCollectionByLabel,
  }
}

export default useFilter
