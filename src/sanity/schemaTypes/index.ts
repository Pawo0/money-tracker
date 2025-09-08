import { type SchemaTypeDefinition } from 'sanity'
import user from "./user"
import category from "./category"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user, category],
}
