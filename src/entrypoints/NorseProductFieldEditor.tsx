import { RenderFieldExtensionCtx } from "datocms-plugin-sdk"
import { Canvas } from "datocms-react-ui"
import ProductCategories from "../components/ProductCategories/ProductCategories"

type PropTypes = {
  ctx: RenderFieldExtensionCtx
}

export default function NorseProductFieldEditor ({ ctx }: PropTypes) {
  return (
    <Canvas ctx={ctx}>
      <ProductCategories ctx={ctx} />
    </Canvas>
  )
}