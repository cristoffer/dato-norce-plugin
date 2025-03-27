type RelationShipType = {
  field: any
  property: RelationShipPropertyType
}

export type RelationShipPropertyType = {
  path: string,
  value: string | number | boolean
}

export default RelationShipType