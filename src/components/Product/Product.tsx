import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Button } from "datocms-react-ui";
import { get } from 'lodash'
import ProductType from "../../types/product";
import RelationShipType from "../../types/relationship";
import { SUPPORTED_FIELD_TYPES } from "../../utils/variables";

type PropTypes = {
  ctx: RenderFieldExtensionCtx
  product: ProductType
}

export default function Product ({ product, ctx }: PropTypes) {

  function handleClick () {
    ctx.setFieldValue(ctx.fieldPath, ctx.field.attributes.field_type === 'string' ? `${product.Id}` : product.Id);

    checkForAdditionalData()
  }

  function getValue () {
    const val = get(ctx.formValues, ctx.fieldPath)

    return `${val}`
  }

  /** 
  * This function us used to filter out auto assigned fields,
  * it is used if we DONT want to show the auto assigned fields in the modal

  function filterConfiguredFields (relatedFields: Array<any>, relationships: Array<any>) {
    return relatedFields.filter((field) => {
      const found = relationships.find((rel) => rel.field.id === field.id)
      return !found
    })
  }
  */

  function isSupportedFieldType (fieldType: string) {
    return SUPPORTED_FIELD_TYPES.includes(fieldType)
  }

  async function checkForAdditionalData () {
    const fieldRelationship = ctx.field.relationships.item_type.data.id
    const fields = Object.keys(ctx.fields).map((key) => ctx.fields[key])
    let relatedFields = fields.filter((field) => 
      field?.relationships.item_type.data.id === fieldRelationship && 
      field.id !== ctx.field.id &&
      isSupportedFieldType(field.attributes.field_type))

    const relationships = ctx.plugin.attributes.parameters.relationships as Array<RelationShipType>
    let autoAssigned = null

    if (relationships?.length) {
      //relatedFields = filterConfiguredFields(relatedFields, relationships) // filter out auto assigned fields
      autoAssigned = autoAssignValues()
    }

    if (relatedFields?.length) {
      ctx.openModal({
        id: 'additionalProductDataModal',
        title: `Additional data from "${product.Name}"`,
        width: 'l',
        parameters: { product: product, relatedFields: relatedFields, autoAssigned:  autoAssigned},
      }).then((result) => {
        if (result) {
          setFiledValues(result as Array<RelationShipType>)
        }
      })
    }
  }

  function fieldHasValue(field: any) {
    const basePath = ctx.fieldPath.split('.').slice(0, -1).join('.')
    return !!get(ctx.formValues, `${basePath}.${field.attributes.api_key}`)
  }

  function autoAssignValues() {
    let relationships = ctx.plugin.attributes.parameters.relationships as Array<RelationShipType> || []
    
    relationships = relationships.filter((rel) => {
      return !fieldHasValue(rel.field)
    })

    if (relationships.length) {
      ctx.notice(`${relationships.length} value${relationships.length > 1 ? 's were' : ' was'} auto-assigned`)
      setFiledValues(relationships)
    }

    return relationships
  }

  function setFiledValues (relationships: Array<RelationShipType>) {
    const basePath = ctx.fieldPath.split('.').slice(0, -1).join('.')
    relationships.forEach((rel) => {
      ctx.setFieldValue(`${basePath}.${rel.field.attributes.api_key}`, get(product, rel.property.path))
    })
  }

  const value = getValue()

  return (
    <Button 
      onClick={() => handleClick()} 
      buttonType={value === `${product.Id}` ? "primary" : "muted"}
      buttonSize="xxs" 
      fullWidth >
      {product.Name}
    </Button>
  )
}