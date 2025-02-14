import { Button, Canvas } from "datocms-react-ui";
import _ from "lodash";
import ProductType from "../types/product";
import { useState } from "react";
import { RenderModalCtx } from "datocms-plugin-sdk";

type RelationShipType = {
  field: any
  path: string
}

type PropTypes = {
  ctx: RenderModalCtx
}

export default function AdditionalProductDataModal ({ ctx }: PropTypes) {
  const [selectedField, selectField] = useState<any>(null)
  const [relationships, setRelationships] = useState<Array<RelationShipType>>([])
  const [latestPath, setLatestPath] = useState<string | null>(null)

  function setValue (path: string) {
    setRelationship(selectedField, path)
  }

  function setRelationship (field: any, path: string) {
    const index = relationships.findIndex((rel) => rel.field.id === field.id)

    if (index >= 0) {
      relationships.splice(index, 1); 
    }

    relationships.push({ field: selectedField, path: path })
    setRelationships(relationships)
    setLatestPath(path)
  }

  function removeRelationship (field) {
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
      content: 'You can choose to save the relationship in the plugin settings, you can remove the relationships from the config screen later.',
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

  function saveRelationships () {
    let rels = ctx.plugin.attributes.parameters.relationships as Array<any> || []
    rels = rels.concat(relationships)

    ctx.updatePluginParameters({ ...ctx.plugin.attributes.parameters, 'relationships': rels})
    saveValues()
  }

  return (
    <Canvas ctx={ctx}>
      <p>We found some inputfields that seem related to your product, we can inject additional data from the product into them.</p>
      <p>Select a field on the left and then select a product property on the right. Property values of the wrong type will be disabled.</p>
      <div style={{display: 'flex'}}>
        <div style={{ width: '30%'}}>
          <h4>Related Fields</h4>
          {ctx?.parameters?.relatedFields?.map((field: any, index: number) =>(
            <div key={index}>
              <RenderField 
                product={ctx.parameters.product} 
                selectField={setField} 
                latestPath={latestPath} 
                field={field} 
                removeRelationship={removeRelationship}
                selectedField={selectedField} 
                relationships={relationships} />
            </div>
          ))}
        </div>
        <div style={{ width: '70%'}}>
          <h4>Product Data</h4>
          {Object.keys(ctx?.parameters?.product as ProductType).map((key, index) => (
            <div key={index}>
              <RenderProp product={ctx.parameters.product as ProductType}  path={key} selectedField={selectedField} setValue={(path: string) => setValue(path)}/>
            </div>
          ))}
        </div>
      </div>

      <Button buttonSize="s" onClick={() => save()}>Save</Button>

    </Canvas>
  )
}

type RenderFieldType = {
  field: any
  selectedField: any 
  selectField: (field: any | null) => void
  relationships: Array<RelationShipType>
  latestPath: string | null
  product: ProductType | null
  removeRelationship: (field: any) => void
}

function RenderField ({ field, selectedField, selectField, relationships, product, removeRelationship}: RenderFieldType) {

  function findRelatedValue() {
    const relationship = relationships.find((rel) => rel.field.id === field.id)
    if (relationship) {
       return '' + _.get(product, relationship?.path)
    }

    return ''
  }

  function handleClick () {
    if (selectedField?.id === field.id) {
      selectField(null)
    } else {
      selectField(field)
    }
  }

  function removeRelation () {
    removeRelationship(field)
  }

  const value = findRelatedValue()

  return (
    <div>
      <Button buttonSize="xxs" buttonType={selectedField?.id === field.id ? 'primary' : 'muted'} onClick={() => handleClick()}>+</Button>
      {field.attributes.label} 
      <div>
        {value}
        {value && <Button buttonSize="xxs" buttonType="negative" onClick={() => removeRelation()}>-</Button>}
      </div>
    </div>
  )
}

type RenderPropType = {
  path: string
  product: ProductType
  selectedField: any
  setValue: (path: string) => void
}

function RenderProp ({product, path, selectedField, setValue}: RenderPropType) {
  const value = _.get(product, path)

  if (!value) return null
  
  if (Array.isArray(value)) {
    if (value.length) {
      return (
        <>
          {value.map((v, index) => (<RenderProp product={product} path={`${path}[${index}]`} selectedField={selectedField} setValue={setValue}/>))}
        </>
      )
    } else {
      return null
    }
  }

  if (typeof value === 'object') {
    return (
      <>
        {Object.keys(value).map((key, index) => (
          <RenderProp key={index} product={product} path={`${path}.${key}`} selectedField={selectedField} setValue={setValue}/>
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

  

  return (<div><Button disabled={!selectedField || !hasSameType()} onClick={() => setValue(path)} buttonType="muted" buttonSize="xxs">+</Button> <b>{path}</b> {`${value}`} </div>)

}