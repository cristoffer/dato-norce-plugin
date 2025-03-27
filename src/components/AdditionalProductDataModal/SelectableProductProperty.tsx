import { Button } from "datocms-react-ui"
import ProductType from "../../types/product"
import { get } from "lodash"
import RelationShipType, { RelationShipPropertyType } from "../../types/relationship"
import styles from "./styles.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

type PropTypes =  {
  path: string
  product: ProductType
  selectedField: any
  relationships: Array<RelationShipType>
  setValue: (property: RelationShipPropertyType) => void
}

export default function SelectableProductProperty ({ product, path, selectedField, setValue, relationships }: PropTypes) {
  const value = get(product, path)

  if (!value) return null

  /* Recursive in case of array type value */
  if (Array.isArray(value)) {
    if (value.length) {
      return (
        <>
          {value.map((_v, index) => (<SelectableProductProperty relationships={relationships} product={product} path={`${path}[${index}]`} selectedField={selectedField} setValue={setValue}/>))}
        </>
      )
    } else {
      return null
    }
  }

  /* Recursive in case of object type value */
  if (typeof value === 'object') {
    return (
      <>
        {Object.keys(value).map((key, index) => (
          <SelectableProductProperty relationships={relationships} key={index} product={product} path={`${path}.${key}`} selectedField={selectedField} setValue={setValue}/>
        ))}
      </>
    )
  }
  
  function hasSameType (): boolean {
    switch (selectedField?.attributes.field_type) {
      case 'boolean':
        return typeof value === 'boolean'
      case 'text':
      case 'string':
        return typeof value === 'string' || typeof value === 'number'
      case 'integer':
        return typeof value === 'number' && value % 1 === 0
      case 'float':
        return typeof value === 'number'
      default:
        return true
    }
  }

  function handleClick (e: any) {
    e.stopPropagation();
    setValue({
      path: path,
      value: get(product, path)
    })
  }

  function hasRelation () {
    const found = relationships.find((rel) => rel.property.path === path)
    return !!found
  }

  if (hasRelation()) {
    return null
  }

  return (
    <div className={styles.selectableFieldWrapper} >
      <Button 
        disabled={!selectedField || !hasSameType()} 
        onClick={(e) => handleClick(e)} 
        buttonType="muted" 
        buttonSize="xxs"><FontAwesomeIcon icon={faPlus} /></Button>
      <span><b> {path}:</b> {`${value}`}</span>
    </div>
  )
}