# Data Normalization

## Objectives

* Normalizes data to the Third Normal Form
* Model relationships using ERD

### Entry Ticket

* `CREATE TABLE`s in SQL
* `SELECT` from Tables in SQL
* `JOIN` multiple tables in SQL
* ERDs

### Key Terms

- Schema
- Join Tables
- Normalization
- Normal Forms
- First Normal Form
- Second Normal Form
- Third Normal Form

## Guiding Questions

* What is normalization, and why would you want to do it?
* What is first normal form (1NF)? Give an example.
* What is second normal form (2NF)? Give an example.
* What is third normal form (3NF)? Give an example.
* What is denormalization, and why would you want to do it?

### Data Modeling

When we talk about Data Modeling, we're talking about the shape of your data. What type of information is it composed of? How is it structured? We're taking a real, concrete thing, and making it abstract.

Most data we model is a representation of a real-world object or idea. A car, a book, a movie, a blog post, a status update, a coupon, an order, a user, a customer. There are many examples, and what we model depends on the application we're building.

When we model our data, we create what's called a _schema_.

The first thing we should do is think about what we're modeling. These are typically **nouns**. Nouns have attributes, and attributes have values.

### Normalization

When we talk about _Data Normalization_, we're referring to how much data must be repeated within our database, and how canonical each entity is. There are several categories, called _Normal Forms_, with decreasing repetition and increasing complexity.

Here's an example of normalized data that is not normalized:

    Name : Shirley
    Job Title : night shift supervisor
    Phone : 555-1234
    Phone : 555-3434
    Phone : 480-555-6968

    First Name : Carol
    Job Title : Shift Supervisor (night)
    Last Name : Willikers
    Phone : 680-555-1209

The data above has keys and values, but it's all over the place. Some phone numbers have area codes, and some do not. Shirley has no last name, and her Name field isn't structured the same way as Carol's is, who has a First Name and Last Name field. They're both night shift supervisors, but the way it's written makes it hard for a computer to compare. Shirley has 3 phone numbers, with no way to tell which one is for what purpose. It would be extremely hard for a computer to make use of this data!


And here's an example of that same data, normalized so that a computer can work with it:

#### Users

<table>
  <tr>
    <th>ID</th>
    <th>First Name</th>
    <th>Last Name</th>
    <th>Job Title</th>
  </tr>
  <tr>
    <td>1</td>
    <td>Shirley</td>
    <td>null</td>
    <td>Night Shift Supervisor</td>
  </tr>
  <tr>
    <td>2</td>
    <td>Carol</td>
    <td>Willikers</td>
    <td>Night Shift Supervisor</td>
  </tr>
</table>

#### Phones
<table>
  <tr>
    <th>ID</th>
    <th>User_ID</th>
    <th>Phone</th>
    <th>Type</th>
  </tr>
  <tr>
    <td>1</td>
    <td>1</td>
    <td>000-555-1234</td>
    <td>Main</td>
  </tr>
  <tr>
    <td>2</td>
    <td>1</td>
    <td>000-555-3434</td>
    <td>Cell</td>
  </tr>
  <tr>
    <td>3</td>
    <td>1</td>
    <td>480-555-6968</td>
    <td>Emergency</td>
  </tr>
  <tr>
    <td>4</td>
    <td>2</td>
    <td>680-555-1209</td>
    <td>Main</td>
  </tr>
</table>

This structure is far more normalized, and far more useful.

Think of these as a spectrum- with First Normal Form being the least complex and abstract, and Third Normal Form being the most complex and abstract.

#### 1st NF
If you're using SQL, you're at least using First Normal Form. First Normal Form is the idea that every _record_, or row in a table, has the same number of fields. You can't really define a table in an RDBMS that that has variable columns, so the act of making a table means it's at least in First Normal Form.

Formally - ***Under first normal form, all occurrences of a record type must contain the same number of fields.***

#### 2nd NF

Second Normal Form comes into play when you start to deal with *Join Tables*. Join tables relate two or more entities together, sometimes with additional information.

In a blog, you have Users, Posts, and Comments.

    Users
    ------
    ID
    Name
    Email

    Posts
    -----
    ID
    Title
    Post
    User_ID

    Comments
    --------
    ID
    Post_ID
    User_ID
    Title
    Comment

Comments _joins together_ Posts and Users. It also only has information that doesn't belong on Post or User (such as the title of the comment, or the comment itself).

If we were to add information about the Post or the User, we would be "Violating 2nd Normal Form". If we were to keep the email of the User who commented on the comment, for example, this would be violating 2nd Normal Form. This is because the User already has the email, and that information belongs to User. If a User commented multiple times, we would be duplicating that email in that table, which is completely unnecessary.

Formally - ***Second normal form is violated when a non-key field is a fact about a subset of a key. It is only relevant when the key is composite, i.e., consists of several fields.***

#### 3rd NF
Third Normal Form is when things start to get fairly abstracted. Often when designing a table, information is simply grouped together based on how it's going to be retrieved.
    Movie
    -----
    ID
    Title
    Director
    Release_Date
    Country

In this example, Movies must be duplicated when released on different dates in different countries. The Director is going to be the same each time, as is the Title, while the Release Date and Country will differ. There are some problems here:

* The Director field could become inconsistent
* If the Director changes, every record has to be updated
* The Director gets repeated for each Movie, as well as the Title.

To do this properly, redundancies should be reduced. Releases are a many-to-one relationship to movies, and should be represented thus:

    Movie
    -----
    ID
    Title
    Director

    Releases
    --------
    ID
    Movie_ID
    Release_Date
    Country



### How Do I Decide?

Deciding how far along to take your database is a tricky prospect. On one hand, very abstract data models with many associations allows a lot of expansion within your data model. Think of Normalization as DRYing (Don't Repeat Yourself) up your database's schema. Your database is very abstracted in 3rd Normal Form, and with the right abstractions you can build a very solid and maintainable foundation.

On the other hand, you'll run into the YAGNI (You Ain't Gonna Need It) principle. You often can't predict the kind of flexibility you'll need in your data model, so you can't always tell where to put the abstraction.

Rules of Thumb:
* Things that are likely to grow, like users contact information, should be many-to-many.
* If it's a noun (an Order, a Product, a Book, a Park, an Author, etc) it probably needs it's own table and a relationship.
* Use varchar and text types if you only need many options along one field that might have more options than you realized in the beginning - like "Gender", "Relationship Status", "Country", "Payment Type", "Contact Preference". Creating another table to ensure a constrained list of options is chosen from is often considered over-engineering.
* The more normalized your data is, the more consistent it is. If you're interested in analyzing the data and drawing inferences later, you want to make sure it is as consistent as possible. On the flip side, don't introduce artificial bias by creating too many constraints based on untested assumptions.

## Slides

* [Normalization Slides](https://docs.google.com/a/galvanize.com/presentation/d/1XQ-cst2L-g7T4Nh2OxCSHgdEGhRRMAvvzrNvAcdFIig/edit?usp=sharing)

## Challenges

[Repo](https://github.com/gSchool/dataModels)

### Challenge 1

Normalize this

![data model](https://s3-us-west-2.amazonaws.com/lesson-plan-images/normalization_images/Normalization+Exercises+-+Denormalized.jpeg)

Solution Notes

* An over the top solution:
  ![over the top solution](https://s3-us-west-2.amazonaws.com/lesson-plan-images/normalization_images/Normalization+Exercises+-+Normalized.jpeg)
* This model used lookup tables for the types of dates and payments
* `sale_price` is on the `Order_Item` table to lock in the item's price at the point of sale. This is _critical_- if left out, the price of the historical transaction will fluctuate whenever the price of any of the items change.
* The dates don't technically have to be normalized for this to be in 3NF. However, normalizing them out allows you to store different kinds of dates in the future, and reduces blank columns for things that may not apply to a particular order (such as shipping).

### Challenge 2

Normalize this

<img src="https://s3-us-west-2.amazonaws.com/lesson-plan-images/normalization_images/Normalization+Exercises+-+Denormalized+2+(1).jpeg" />

Solution Notes

* An over the top solution:
  ![over the top solution](https://s3-us-west-2.amazonaws.com/lesson-plan-images/normalization_images/Normalization+Exercises+-+Normalized+2.jpeg)
* Pregnancy is normalized out as a condition
* Patient can now have multiple weigh-ins
* Physicians can now be a heart specialist for one patient, or primary care physician for another patient

### Challenge #3

Normalize this

![data model](https://s3-us-west-2.amazonaws.com/lesson-plan-images/normalization_images/Normalization+Exercises+-+Denormalized+3.jpeg)

Solution Notes:

* An over the top solution
  ![over the top solution](https://s3-us-west-2.amazonaws.com/lesson-plan-images/normalization_images/Normalization+Exercises+-+Normalized+3.jpeg)
* The user agreement may not technically need to be normalized out, but it allows for multiple kinds of agreements (such as for each subscription
* Normalizing out images is optional, but allows you to store every image url in one central store. This aids in things like updating URLs.

## More Normal Forms

* Boyce-Codd Normal Form (BCNF)
* Fourth Normal Form (4NF)
* Fifth Normal Form (5NF)
* Domain-key Normal Form (DK/NF)

## Resources

* [Wikipedia](https://en.wikipedia.org/wiki/Database_normalization)
* [About](http://databases.about.com/od/specificproducts/a/normalization.htm)
* [Tutorials Point](http://www.tutorialspoint.com/dbms/database_normalization.htm)
* [Normalization Walkthrough](http://holowczak.com/database-normalization/)

## Guiding Question Answers

* What is normalization, and why would you want to do it?

> Normalization is the process of removing redundancy in a database. You normalize data to remove duplicate references that need to be syncronized, allowing you the flexibility to change a piece of data in one place instead of many.

* What is first normal form (1NF)? Give an example.

> No repeating rows. Something is in 1NF if every column has one and only one entry in each row.
> A column that has a list of colors, or a list of cities, or any kind of multiple value for a single column.

* What is second normal form (2NF)? Give an example.

> No partial dependencies. Something is in 2NF if every is non-key column is dependent on the primary key.
> A `Registration` table that has a `student_id`, a `class_id`, and a `student_name`. The `student_name` is only dependent on the `student_id`, so it should go to that column.

* What is third normal form (3NF)? Give an example.

> No transitive dependencies. Something is in 3NF if every column in a table is dependent on only the PK directly, not via its relationship to another column.
> A `Order` table that has `payment_type` and `payment_amount` columns. These depend on each other, but not the `id`. They should be abstracted out into a `Payment` table.

* What is denormalization, and why would you want to do it?

> Data that's spread across many tables is accessed with `JOIN` statements. Join statements are comparatively expensive in SQL, and lots of `JOIN` statements may unacceptably impact performance-sensitive tasks.

## Push Questions

* If denormalization is so fast, what would it be like to denormalize as much as possible and enforce relationships outside the database?

> This is the general concept behind NoSQL

* What are some things that can go wrong if you don't normalize?

> All the data might not show up on a query because they were entered in differently in different places
> Data can get updated in one place but not another, ruining the referential integrity of the database
> It may difficult to extend the functionality of a table because it's coupled to unrelated data
