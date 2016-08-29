module.exports = {

  path: './README.md',

  sections: [
    {
      title: 'Intro to SQL',
      links: [
        {text: 'Intro to Relational Databases', url: './Intro.md'},
        {
          text: 'Installing PostgreSQL',
          links: [
            {text: 'With Homebrew', url: './Install - Homebrew.md'},
            {text: 'Or with Postgres.app', url: './Install - App.md'},
          ]
        },
        {text: 'PSQL - PostgreSQL Command Line Tools', url: './PSQL.md'},
        {text: 'DDL and DML', url: './SQL Intro.md'},
        {text: 'SQL Operators', url: './Operators.md'},
        {text: 'Common Functions', url: './Common Functions.md'},
      ]
    },
    {
      title: 'Relationships and Joins',
      links: [
        {text: 'Introduction to Joins and Relationships', url: './Joins.md'},
        {text: 'Entity Relationship Diagrams', url: './Entity Relationship Diagrams.md'},
        {
          text: 'Normalization', url: './Normalization.md',
          links: [
            {text: "More Normalization Examples", url: "./Normalization Examples.md"}
          ]
        },
      ]
    },
    {
      title: 'Additional Topics',
      links: [
        {text: 'Indexes', url: './Indexes.md'},
        {text: 'Sets and Subqueries', url: './Sets and Subqueries.md'},
        {text: 'Roles and Permissions', url: './Roles and Permissions.md'},
        {text: 'Views', url: './Views.md'},
      ]
    },
  ]

};
