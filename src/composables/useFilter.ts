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
} => {

  const removeChildByLabel = (_entity: NestedDataObject, _parentCollectionLabel: string, _label: string) => {
    const entity = JSON.parse(JSON.stringify(_entity)) as NestedDataObject
    if (entity.metadataCollection) {
      const matchingWithParentLabel = entity.metadataCollection.filter(_parentCollection => _parentCollection.label == _parentCollectionLabel)
      for (const _parentMatch of matchingWithParentLabel) {
        if (_parentMatch.nested && _parentMatch.data) {
          for (const _data of _parentMatch.data) {
            const matchingWithLabel = _data?.nestedMetaData?.metadataCollection?.filter(_meta => _meta?.label == _label)
            if(matchingWithLabel){
              for(const _childMatch of matchingWithLabel){
                const index = _data?.nestedMetaData?.metadataCollection?.indexOf(_childMatch)
                _data?.nestedMetaData?.metadataCollection?.splice(index as number,1)
                if(_data?.nestedMetaData?.metadataCollection?.length == 0){
                  const index = _parentMatch.data.indexOf(_data);
                  _parentMatch.data.splice(index,1)
                }
              }
            }
          }
        }
      }
    }
    return entity
  };

  return { removeChildByLabel }
};

export default useFilter;