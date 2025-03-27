import { faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Button, FieldGroup, TextField } from "datocms-react-ui";
import { useEffect, useState } from "react";
import styles from "./styles.module.css"
import { get } from "lodash";

type PropTypes = {
  ctx: RenderFieldExtensionCtx
  fallback: (show: boolean) => void 
}

export default function FallbackInputField ({ ctx, fallback}: PropTypes) {
  
  function getValue() {
    const value = get(ctx.formValues, ctx.fieldPath)
    return value || ctx.field.attributes.default_value || ''
  }
  
  const [ val, setVal] = useState<any>(getValue())

  useEffect(() => {
    ctx.setFieldValue(ctx.fieldPath, ctx.field.attributes.field_type === 'string' ? `${val}` : val);
  }, [val])

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <FieldGroup>
          <TextField
            required={!!ctx.field.attributes.validators.required}
            name={ctx.field.attributes.api_key}
            id={ctx.field.id}
            label={ctx.field.attributes.label}
            value={val}
            placeholder="Enter manually"
            hint={ctx.field.attributes.hint}
            onChange={(newValue) => setVal(newValue)}
          />
        </FieldGroup>
      </div>
      <div>Or</div>
      <div className={styles.fallbackButton}>
        <Button onClick={() => fallback(false)} buttonSize="xxs" buttonType="muted">Browse Products <FontAwesomeIcon icon={faList} /></Button>
      </div>
    </div>
  )
}