import { Button } from "datocms-react-ui"
import RelationShipType from "../../types/relationship"
import { MouseEvent } from "react"
import styles from "./styles.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

type PropTypes = {
  field: any
  selectedField: any 
  selectField: (field: any | null) => void
  relationships: Array<RelationShipType>
  latestPath: string | null
}

export default function SelectableFields ({ field, selectedField, selectField, relationships }: PropTypes) {
  function handleClick (e: MouseEvent) {
    e.stopPropagation();
    if (selectedField?.id === field.id) {
      selectField(null)
    } else {
      selectField(field)
    }
  }

  function hasRelatedValue () {
    const relationship = relationships.find((rel) => rel.field.id === field.id)
    return !!relationship
  }

  if (hasRelatedValue()) {
    return null
  }

  return (
    <div className={styles.selectableFieldWrapper}>
      <Button 
        buttonSize="xxs" 
        buttonType={selectedField?.id === field.id ? 'primary' : 'muted'} 
        onClick={(e) => handleClick(e)}><FontAwesomeIcon icon={faPlus} /></Button>
      <b> {field.attributes.label}</b>
    </div>
  )
}