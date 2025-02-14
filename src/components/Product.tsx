import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Button } from "datocms-react-ui";
import _ from 'lodash'
import ProductType from "../types/product";

type PropTypes = {
  ctx: RenderFieldExtensionCtx
  product: ProductType
}

export default function Product ({ product, ctx }: PropTypes) {

  function handleClick () {
    // if (getValue() === `${product.Id}`) {
    //   ctx.setFieldValue(ctx.fieldPath, '')
    // } else {
    //   ctx.setFieldValue(ctx.fieldPath, ctx.field.attributes.field_type === 'string' ? `${product.Id}` : product.Id);

    //   checkForAdditionalData()
    // }

    ctx.setFieldValue(ctx.fieldPath, ctx.field.attributes.field_type === 'string' ? `${product.Id}` : product.Id);

    checkForAdditionalData()
  }

  function getValue () {
    const val =  _.get(ctx.formValues, ctx.fieldPath)

    return `${val}`
  }

  function filterConfiguredFields (relatedFields: Array<any>, relationships: Array<any>) {
    return relatedFields.filter((field) => {
      const found = relationships.find((rel) => rel.field.id === field.id)
      return !found
    })
  }

  async function checkForAdditionalData () {
    const fieldRelationship = ctx.field.relationships.item_type.data.id
    const fields = Object.keys(ctx.fields).map((key) => ctx.fields[key])
    let relatedFields = fields.filter((field) => field?.relationships.item_type.data.id === fieldRelationship && field.id !== ctx.field.id)

    if (ctx.plugin.attributes.parameters.relationships?.length) {
      relatedFields = filterConfiguredFields(relatedFields, ctx.plugin.attributes.parameters.relationships)
      autoAssignValues()
    }

    if (relatedFields?.length) {
      ctx.openModal({
        id: 'additionalProductDataModal',
        title: `Additional data from "${product.Name}"`,
        width: 'l',
        parameters: { product: product, relatedFields: relatedFields},
      }).then((result) => {
        if (result) {
          setFiledValues(result)
        }
      })
    }
  }

  function autoAssignValues() {
    ctx.notice(`${ctx.plugin.attributes.parameters.relationships.length} values were auto-assigned`)
    setFiledValues(ctx.plugin.attributes.parameters.relationships)
  }

  function setFiledValues (relationships) {
    const basePath = ctx.fieldPath.split('.').slice(0, -1).join('.')

    relationships.forEach((rel) => {
      ctx.setFieldValue(`${basePath}.${rel.field.attributes.api_key}`, _.get(product, rel.path))
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