import { Button, ButtonGroup, Canvas } from "datocms-react-ui"
import ProductType from "../../types/product"
import { useEffect, useState } from "react"
import { RenderModalCtx } from "datocms-plugin-sdk"
import RelationShipType, { RelationShipPropertyType } from "../../types/relationship"
import SelectableFields from "./SelectableField"
import SelectableProductProperty from "./SelectableProductProperty"
import styles from "./styles.module.css"
import { faMinus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type PropTypes = {
  ctx: RenderModalCtx
}

export default function AdditionalProductDataModal ({ ctx }: PropTypes) {
  const [selectedField, selectField] = useState<any>(null)
  const [relationships, setRelationships] = useState<Array<RelationShipType>>([])
  const [latestPath, setLatestPath] = useState<string | null>(null)

  function setValue (property: RelationShipPropertyType) {
    setRelationship(selectedField, property, false)
  }

  useEffect(() => {
    const autoAssigned = ctx.parameters.autoAssigned as Array<RelationShipType>

    if (autoAssigned?.length) {
      autoAssigned.forEach((auto) => {
        setRelationship(auto.field, auto.property, true)
      })
    }
  },[])

  function setRelationship (field: any, property: RelationShipPropertyType, autoAssigned: boolean) {
    const index = relationships.findIndex((rel) => rel.field.id === field.id)

    if (index >= 0) {
      relationships.splice(index, 1); 
    }

    let f = selectedField

    if (autoAssigned) {
      f = ctx.fields[field.id]
    }

    relationships.push({ field: f, property: property })
    setRelationships(relationships)
    setLatestPath(property.path)
  }

  function removeRelationship (field: any) {
    const index = relationships.findIndex((rel) => rel.field.id === field.id)
    if (index >= 0) {
      relationships.splice(index, 1)
      setRelationships(relationships)

    }
    setLatestPath(field.attributes.api_key)
  }

  function setField (field: any) {
    selectField(field)
  }

  function save () {
    ctx.openConfirm({
      title: 'Save Relationships',
      content: 'You can choose to save the relationship between the block fields and the Norce product. Saved relationships will enable auto population of fields in the future. Saved relationships can be managed in the plugin config.',
      choices: [
        {
          label: 'Save Values and Relationships',
          value: 'positive',
          intent: 'negative',
        },
        {
          label: 'Save Values only',
          value: 'negative',
          intent: 'positive',
        },
      ],
      cancel: {
        label: 'Cancel',
        value: false,
      },
    }).then((res) => {
      switch (res) {
        case 'positive':
          saveRelationships()
          break;
        case 'negative':
          saveValues()
          break
        case false:
        default:
          break;
      }
    })
  }

  function saveValues() {
    ctx.resolve(relationships)
  }

  function close () {
    ctx.resolve(false)
  }

  function saveRelationships () {
    let rels = ctx.plugin.attributes.parameters.relationships as Array<any> || []
    rels = rels.filter((rel) => {
      const override = relationships.find((newRel) => newRel.field.id === rel.field.id)
      return !override
    })

    rels = rels.concat(relationships)

    ctx.updatePluginParameters({ ...ctx.plugin.attributes.parameters, 'relationships': rels})
    saveValues()
  }

  const relatedFields = ctx.parameters?.relatedFields as Array<any>
  const product = ctx.parameters?.product as ProductType

  return (
    <Canvas ctx={ctx}>
      <p>We found some inputfields that seem related to your product, we can inject additional data from the product into them.</p>
      <p>Select a field on the left and then select a product property on the right. Property values of the wrong type will be disabled.</p>
      <div className={styles.selectTableHead}>
        <h4>Related Fields</h4>
        <h4>Product "{product.Name}"</h4>
      </div>

      {!!relationships.length && 
        <div className={styles.relationshipsWrapper}>
          {relationships.map((rel, index) => (
            <div key={index} className={styles.relationship}>
              <div>
                <Button buttonSize="xxs" buttonType="negative" onClick={() => removeRelationship(rel.field)}>
                  <FontAwesomeIcon icon={faMinus} />
                </Button>
                <span> <b>{rel.field.attributes.label}</b></span>
              </div>
              <div className={styles.relationshipValue}>
                <b className={styles.relationshipPath}>{rel.property.path}: </b> { `${rel.property.value}`}
              </div>
            </div>
          ))}
        </div>
      }

      <div className={styles.selectTable} onClick={() => selectField(null) }>
        <div className={styles.firstColumn}>
          {relatedFields?.map((field: any, index: number) =>(
            <SelectableFields 
              key={index}
              selectField={setField} 
              latestPath={latestPath} 
              field={field} 
              selectedField={selectedField} 
              relationships={relationships} />
          ))}
        </div>
        <div>
          {Object.keys(ctx?.parameters?.product as ProductType).map((key, index) => (
              <SelectableProductProperty
                relationships={relationships}
                key={index}
                product={product} 
                path={key} 
                selectedField={selectedField} 
                setValue={(property: RelationShipPropertyType) => setValue(property)}/>
          ))}
        </div>
      </div>

      <ButtonGroup>
        <Button buttonSize="s" onClick={() => close()} buttonType="negative">Cancel</Button>
        <Button buttonSize="s" onClick={() => save()} disabled={!relationships.length}>Save</Button>
      </ButtonGroup>
    </Canvas>
  )
}