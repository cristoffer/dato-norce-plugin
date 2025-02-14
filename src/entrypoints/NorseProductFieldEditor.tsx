import { RenderFieldExtensionCtx } from "datocms-plugin-sdk"
import { Canvas } from "datocms-react-ui"
import ProductCategories from "../components/ProductCategories"
import _ from 'lodash'

type PropTypes = {
  ctx: RenderFieldExtensionCtx
}

export default function NorseProductFieldEditor ({ ctx }: PropTypes) {

  function getValue () {
    const val =  _.get(ctx.formValues, ctx.fieldPath)
    return val
  }

  const value = getValue()

  return (
    <Canvas ctx={ctx}>
      <h2>Product {value ? `(${value})` : ''}</h2>
      <ProductCategories ctx={ctx} />
    </Canvas>
  )
}