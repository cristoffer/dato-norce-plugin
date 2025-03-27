import { RenderFieldExtensionCtx } from "datocms-plugin-sdk"
import { useEffect, useState } from "react"
import ProductsByCategory from "../ProductsByCategory/ProductsByCategory"
import { Button, Spinner } from "datocms-react-ui"
import ProductCategoryType from "../../types/productCategory"
import FallbackInputField from "../FallbackInputField/FallbackInputField"
import { get } from 'lodash'
import { sortAlfabeticallyValue } from "../../utils/sortAB"
import styles from "./styles.module.css"

type PropTypes = {
  ctx: RenderFieldExtensionCtx
}

export default function ProductCategories ({ ctx }: PropTypes) {
  const [categories, setCategories] = useState<Array<ProductCategoryType>>()
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryType>()
  const [showFallback, setShowFallback] = useState<boolean>(false)

  useEffect(() => {
    getProductCategories()
  }, [])

  function fallback (show: boolean) {
    setShowFallback(show)
  }

  async function getProductCategories () {
    let categoriesEndpoint = ctx.plugin.attributes.parameters.categoriesEndpoint || ''

    if (!categoriesEndpoint) {
      ctx.alert('No categories endpoint specified in plugin config!')
      return
    }

    try {
      const response = await fetch(`${categoriesEndpoint}`)
      const data = await response.json()

      if (data.success) {
        setCategories(data.categories.sort(sortAlfabeticallyValue))
      }
    } catch (err) {
      setShowFallback(true)
      ctx.alert('could not fetch product categories')
    }
  }

  if (showFallback){
    return <FallbackInputField ctx={ctx} fallback={fallback} />
  }

  if (!categories?.length) {
    return (
      <div className={styles.loaderContainer}><Spinner /></div>
    )
  }

  function getValue () {
    return get(ctx.formValues, ctx.fieldPath)
  }

  const value = getValue()

  return (
    <div className={styles.container}>
      <div className={styles.fallbackButton}>
        <Button onClick={() => fallback(true)} buttonSize="xxs" buttonType="muted">Enter Product ID manually</Button>
      </div>
      <h2>{ctx.field.attributes.label}{value ? <span>{`: ${value}`}</span> : ''}</h2>
      <div className={styles.content}>
        <div className={styles.categoriesContainer}>
          <div>Product Categories</div>
          {categories?.map((category, index) => (
            <div key={index}>
              <Button 
                buttonType={category?.Id === selectedCategory?.Id ? "primary" : "muted"}
                buttonSize="xxs" 
                fullWidth 
                onClick={() => setSelectedCategory(category)}
              >{category.Value}</Button>
            </div>
          ))}
        </div>
        <div className={styles.productsContainer}>
          <div>Products - {selectedCategory?.Value}</div>
          {selectedCategory && <ProductsByCategory category={selectedCategory} ctx={ctx}/>}
        </div>
      </div>
    </div>
  )
}