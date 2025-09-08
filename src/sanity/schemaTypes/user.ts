import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string'
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: {
        list: [
          {title: 'Polish Złoty', value: 'PLN'},
          {title: 'Euro', value: 'EUR'},
          {title: 'US Dollar', value: 'USD'}
        ]
      },
      initialValue: 'PLN',
      validation: (Rule) => Rule.required()
    }),
    defineField({
        name: 'monthlyBudget',
        title: 'Monthly Budget',
        type: 'number',
        initialValue: 1000,
        validation: (Rule) => Rule.required()
      }
    )]
})