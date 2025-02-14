import { RenderFieldExtensionCtx } from "datocms-plugin-sdk"
import { useEffect, useState } from "react"
import { Spinner } from 'datocms-react-ui';
import Product from "./Product";
import ProductCategoryType from "../types/productCategory";
import ProductType from "../types/product";

type PropTypes = {
  ctx: RenderFieldExtensionCtx
  category: ProductCategoryType
}

export default function ProductsByCategory ({ ctx, category}: PropTypes) {
  const [productList, setProductList] = useState<Array<ProductType> | null>(null)
  useEffect(() => {
    setProductList(null)
    if (category) getProductsByCategory()
  }, [category])

  async function getProductsByCategory () {
    let endpoint: string = ctx.plugin?.attributes?.parameters?.categoriesEndpoint as string || ''
    if (endpoint[endpoint.length - 1] !== '/') endpoint += '/'

    const response = await fetch(`${endpoint}${category.Id}`)
    const data = await response.json()

    if (data.success) {
      setProductList(data.categories.Items)
    }
  }

  if (!productList?.length) {
    return (
      <div style={{ 
        height: '100%', 
        width: '100%', 
        display: 'flex', 
        justifyContent:'center', 
        alignItems:'center'}}><Spinner /></div>)
  }

  return (
    <>
      {productList?.map((product, index) => (
        <div key={index}>
          <Product product={product} ctx={ctx} />
        </div>
      ))} 
    </>
  )
}