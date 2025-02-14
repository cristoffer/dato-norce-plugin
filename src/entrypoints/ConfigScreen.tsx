import type { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import { Button, Canvas, FieldGroup, Form, TextField } from 'datocms-react-ui';
import { useState } from 'react';

type Props = {
  ctx: RenderConfigScreenCtx;
};

export default function ConfigScreen({ ctx }: Props) {
  const [categoriesEndpoint, setcategoriesEndpoint] = useState<string>(ctx?.plugin?.attributes?.parameters?.categoriesEndpoint as string || '')

  /**
   * https://localhost:3000/api/norce/products/categories
   * 
   * 
   */

  function saveParameters () {
    ctx.updatePluginParameters({ categoriesEndpoint: categoriesEndpoint })
    ctx.notice('Settings updated successfully!');
  }

  function removeRelationship (relationship: any) {
    const { parameters } = ctx.plugin.attributes
    const filtered = parameters.relationships.filter((item) => item.field.id !== relationship.field.id)

    ctx.openConfirm({
      title: 'Are you sure you want to remove this relationship?',
      content: `${relationship.field.attributes.label} - ${relationship.path}`,
      choices: [
        {
          label: 'Yes',
          value: 'positive',
          intent: 'positive',
        },
        {
          label: 'No',
          value: 'negative',
          intent: 'negative',
        },
      ],
      cancel: {
        label: 'Cancel',
        value: false,
      },
    }).then((res) => {
      if (res === 'positive') {
        ctx.updatePluginParameters({ ...parameters, relationships: filtered})
      }
    })
  }

  return (
    <Canvas ctx={ctx}>
      <h2>Norce Product Injecor Plugin</h2>
      <p>Plug you products in to you Dato models</p>
      <Form onSubmit={() => saveParameters()}>
        <FieldGroup>
          <TextField
            required
            name="categoriesEndpoint"
            id="categoriesEndpoint"
            label="Product Categories Endpoint"
            value={categoriesEndpoint}
            placeholder="http://host.com/api/productCategories"
            hint="Provide a url for the product categories endpoint"
            onChange={(newValue) => setcategoriesEndpoint(newValue)}
          />
          <FieldGroup>
            <Button buttonSize='xs' buttonType="primary" type="submit">Save</Button>
          </FieldGroup>

          <div>
            The API must be set up as follows:
            <ul>
              <li>.../api/categories - to fetch product categories</li>
              <li>.../api/categories/id - to fetch products in specific category</li>
            </ul>
          </div>
          
        </FieldGroup>

        {ctx.plugin.attributes.parameters.relationships?.length && 
          <div>
            <h4>Saved Product - Field relationships</h4>
            <table>
              <thead>
                <tr>
                  <th style={{border: '1px solid black'}}>Block field</th>
                  <th style={{border: '1px solid black'}}>Product prop</th>
                  <th style={{border: '1px solid black'}}>Remove</th>
                </tr>
              </thead>
              <tbody>
                {ctx.plugin.attributes.parameters.relationships.map((rel, index) => (
                  <tr key={index}>
                    <td style={{border: '1px solid black'}}>{rel.field.attributes.label}</td>
                    <td style={{border: '1px solid black'}}>{rel.path}</td>
                    <td style={{border: '1px solid black'}}><Button onClick={() => removeRelationship(rel)} buttonSize='xxs' buttonType='negative' fullWidth>x</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </Form>
    </Canvas>
  );
}
