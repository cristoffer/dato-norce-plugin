import { RenderFieldExtensionCtx } from "datocms-plugin-sdk"
import { useEffect, useState } from "react"
import ProductsByCategory from "./ProductsByCategory"
import { Button } from "datocms-react-ui"
import ProductCategoryType from "../types/productCategory"

type PropTypes = {
  ctx: RenderFieldExtensionCtx
}

export default function ProductCategories ({ ctx }: PropTypes) {
  const [categories, setCategories] = useState<Array<ProductCategoryType>>()
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryType>()

  useEffect(() => {
    getProductCategories()
  }, [])

  function sortAlfabetically (a: ProductCategoryType ,b: ProductCategoryType) {
    if (a.Value < b.Value) {
      return -1;
    }
    if (a.Value > b.Value) {
      return 1;
    }
    return 0;
  }

  async function getProductCategories () {
    let categoriesEndpoint = ctx.plugin.attributes.parameters.categoriesEndpoint || ''

    if (!categoriesEndpoint) {
      ctx.alert('No categories endpoint specified in plugin config!')
      return
    }

    const response = await fetch(`${categoriesEndpoint}`)
    const data = await response.json()

    if (data.success) {
      setCategories(data.categories.sort(sortAlfabetically))
    }
  }

  return (
    <div style={{ display: 'flex', marginBottom: '16px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '300px',
          padding: '0 4px',
          gap: '4px',
          borderRight: '1px solid var(--border-color)',
        }}
      >
        <div>Product Categories</div>
        {categories?.map((category, index) => (
          <div key={index}>
            <Button 
              buttonType={category?.Id === selectedCategory?.Id ? "primary" : "muted"}
              buttonSize="xxs" 
              fullWidth 
              onClick={() => setSelectedCategory(category)}
            >{category.Value} {category?.Id === selectedCategory?.Id}</Button>
          </div>
        ))}
      </div>
      <div
        style={{
          flex: '1',
          display: 'flex',
          padding: '0 4px',
          gap: '4px',
          flexDirection: 'column',
        }}
      >
        <div>Products - {selectedCategory?.Value}</div>
        {selectedCategory && <ProductsByCategory category={selectedCategory} ctx={ctx}/>}
      </div>
    </div>
  )
}