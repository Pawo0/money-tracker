import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      options: {
        list: [
          {title: 'Red', value: '#ef4444'},
          {title: 'Blue', value: '#3b82f6'},
          {title: 'Green', value: '#22c55e'},
          {title: 'Yellow', value: '#eab308'},
          {title: 'Purple', value: '#a855f7'},
          {title: 'Pink', value: '#ec4899'},
          {title: 'Orange', value: '#f97316'}
        ]
      }
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Lucide icon name'
    }),
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{type: 'user'}],
      validation: (Rule) => Rule.required()
    })
  ]
})