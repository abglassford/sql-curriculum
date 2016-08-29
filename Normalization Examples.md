# Data Normalization More Examples

## Zero Normal Form (0NF)

**It's the Wild West for data out there.**

### Exercise

`instructor` table:

| name | position | hobby | hobby2 |
| ---- | -------- | ----- | ------ |
| Kyle | Lead | Databases | |
| Danny | LI | Bird Watching | Hiking, Camping |
| Danny | Instructor | Bird Watching | |
| CJ | Inst | Games | Skiing |

### Attributes

* Duplicated values
* Rows aren't uniquely identified
* Inconsistent field constraints

### Ratio

* Create a table with lots of duplicated information in it.

## First Normal Form (1NF)

**Make everything atomic. Indivisible.**

### Exercise

`instructor` table:

| name | position | hobby | hobby2 |
| ---- | -------- | ----- | ------ |
| Kyle | Lead | Databases | |
| Danny | LI | Bird Watching | Hiking, Camping |
| Danny | Instructor | Bird Watching | |
| CJ | Inst | Games | Skiing |

Reduce the number of `hobby` columns.

Explode the `hobby` lists to rows.

### Attributes

* **Cells can only contain a single indivisible value.**
* A column can only contain 1 type of value.
* No 2 Columns can share an attribute type.
* Order of columns and rows do not matter.

### Ratio

`recipe` table:

| name | ingredient 1 | ingredient 2 | ingredient 3 |
| ---- | ------------ | ------------ | ------------ |
| Banana Bread | Bananas | Sugar | Flour |
| Pulled BBQ Chicken | BBQ | Chicken | |
| Peanut Butter & Jelly | Peanut Butter, Jelly, Bread | | |

"Make this table 1NF"

## Second Normal Form (2NF)

**When a composite key is present, remove all non-key columns that do not depend on the composite key.**

### Exercise

`bird` table:

| **name** |
| -------- |
| Towhee |
| Sparrow |
| Junco |

`bird_spotting` table:

| **person** | **bird** | number_spotted | latin_name |
| -------- | ----------- | ------ | ----------- |
| Danny | Towhee | 3 | Pipilo maculatus |
| Danny | Sparrow | 12 | Passer domesticus |
| Elana | Sparrow | 2 | Passer domesticus |
| Danny | Junco | 5 | Junco hyemalis |

Signify your composite keys somehow and communicate it.

Draw a radial diagram of the dependencies in the table.

Move `latin_name` to the correct table.

### Attributes

* All attributes are dependent on the composite key
* All transitive attributes go in another table

### Ratio

`game` table:

| **name** |
| -------- |
| Sonic 3 |
| Doom |
| Starcraft |

`game reviews` table:

| **game** | **console** | rating | release_year|
| -------- | ----------- | ------ | ----------- |
| Sonic 3 | Sega | 5 | 1994 |
| Sonic 3 | Sega | 5 | 1994 |
| Doom | PC | 4 | 1993 |
| Starcraft | PC | 5 | 1998 |

"Make these tables 2NF"

## Third Normal Form (3NF)

**Remove Transitive Dependencies.**

> Every non-key attribute must provide a fact about the key, the whole key, and nothing but the key.
> -- Bill Kent

### Exercise

`person` table:

| **name** |
| -------- |
| Danny |
| Kyle |

`winner` table:

| **event** | winner | height | amount | food |
| --------- | ------ | ------ | ------ | ---- |
| Diet Coke Chug | Kyle | 5'10" | 20 | cans |
| Pancake Snarfing | Danny | 6'1" | 10 | pancake stacks |
| Prune Pruning | Danny | 6'1" | 80 | prunes |

Describe a transitive property.

"If I update any of these columns, do any other columns need to change?"

Move the `height` to the `person` table.

### Attributes

* All columns are related to the primary key.
* If another column needs to be updated when a column is updated, it is transitive.

## Ratio

`person` table:

| **name** |
| ---- |
| Danny |
| Roberto |

`blog_post` table:

| **id** | name | topic | ad_revenue |
| ------ | ---- | ----- | ---------- |
| 0 | Danny | JS | $1 |
| 1 | Roberto | Go | $2 |
| 2 | Roberto | JS | $2 |
| 3 | Danny | Design | $1 |

"Make these tables 3NF"
